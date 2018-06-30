import pdb
import random
import numpy as np
from dist import uniform_dist, delta_dist, mixture_dist
from util import argmax_with_val, argmax
from keras.models import Sequential
from keras.layers.core import Dense
from keras.optimizers import Adam


class MDP:
    # Needs the following attributes:
    # states: list or set of states
    # actions: list or set of actions
    # discount_factor: real, greater than 0, less than or equal to 1
    # start: optional instance of DDist, specifying initial state dist
    #    if it's unspecified, we'll use a uniform over states
    # These are functions:
    # transition_model: function from (state, action) into DDist over next state
    # reward_fn: function from (state, action) to real-valued reward

    def __init__(self, states, actions, transition_model, reward_fn,
                 discount_factor=1.0, start_dist=None):
        self.states = states
        self.actions = actions
        self.transition_model = transition_model
        self.reward_fn = reward_fn
        self.discount_factor = discount_factor
        self.start = start_dist if start_dist else uniform_dist(states)

    # Given a state, return True if the state should be considered to
    # be terminal.  You can think of a terminal state as generating an
    # infinite sequence of zero reward.
    def terminal(self, s):
        return False

    # Randomly choose a state from the initial state distribution
    def init_state(self):
        return self.start.draw()

    # Simulate a transition from state s, given action a.  Return
    # reward for (s,a) and new state, drawn from transition.  If a
    # terminal state is encountered, sample next state from initial
    # state distribution
    def sim_transition(self, s, a):
        return (self.reward_fn(s, a),
                self.init_state() if self.terminal(s) else
                self.transition_model(s, a).draw())

# Perform value iteration on an MDP, also given an instance of a q
# function.  Terminate when the max-norm distance between two
# successive value function estimates is less than eps.
# interactive_fn is an optional function that takes the q function as
# argument; if it is not None, it will be called once per iteration,
# for visuzalization

# The q function is typically an instance of TabularQ, implemented as a
# dictionary mapping (s, a) pairs into Q values This must be
# initialized before interactive_fn is called the first time.


def value_iteration(mdp, q, eps=0.01, max_iters=1000):
    curr = q.copy()
    s = mdp.init_state()
    states = mdp.states
    actions = mdp.actions
    gamma = mdp.discount_factor

    def sp(q, s, a):
        T = mdp.transition_model(s, a)

        ss = 0
        for new_s in T.support():
            ss += T.prob(new_s) * value(q, new_s)

        return ss

    curr = q.copy()
    prev = curr.copy()
    for i in range(max_iters):
        ret = True
        for s in states:
            for a in actions:
                R = mdp.reward_fn(s, a)
                D = gamma * sp(prev, s, a)
                curr.set(s, a, R + D)

                if abs(curr.get(s, a) - prev.get(s, a)) >= eps:
                    ret = False

        prev = curr.copy()

        if ret:
            return curr

# Given a state, return the value of that state, with respect to the
# current definition of the q function


def value(q, s):
    return max(q.get(s, a) for a in q.actions)

# Given a state, return the action that is greedy with reespect to the
# current definition of the q function


def greedy(q, s):
    return argmax(q.actions, lambda a: q.get(s, a))


def epsilon_greedy(q, s, eps=0.5):
    if random.random() < eps:  # True with prob eps, random action
        return uniform_dist(q.actions).draw()
    else:
        return greedy(q, s)


class TabularQ:
    def __init__(self, states, actions):
        self.actions = actions
        self.states = states
        self.q = dict([((s, a), 0.0) for s in states for a in actions])

    def copy(self):
        q_copy = TabularQ(self.states, self.actions)
        q_copy.q.update(self.q)
        return q_copy

    def set(self, s, a, v):
        self.q[(s, a)] = v

    def get(self, s, a):
        return self.q[(s, a)]

    def update(self, data, lr):
        for datum in data:
            s, a, t = datum

            self.q[(s, a)] = (1 - lr) * self.q[(s, a)] + lr * t


def Q_learn(mdp, q, lr=.1, iters=100, eps=0.5, interactive_fn=None):
    s = mdp.init_state()
    for i in range(iters):
        if interactive_fn:
            interactive_fn(q, i)

        a = epsilon_greedy(q, s, eps)
        r, s_prime = mdp.sim_transition(s, a)
        future_val = 0 if mdp.terminal(s) else value(q, s_prime)
        q.update([(s, a, (r + mdp.discount_factor * future_val))], lr)
        s = s_prime

    return q

# Simulate an episode (sequence of transitions) of at most
# episode_length, using policy function to select actions.  If we find
# a terminal state, end the episode.  Return accumulated reward a list
# of (s, a, r, s') whee s' is None for transition from terminal state.


def sim_episode(mdp, episode_length, policy, interactive_fn=False):
    episode = []
    reward = 0
    s = mdp.init_state()
    for i in range(episode_length):
        a = policy(s)
        (r, s_prime) = mdp.sim_transition(s, a)
        reward += r
        if mdp.terminal(s):
            episode.append((s, a, r, None))
            return reward, episode
        episode.append((s, a, r, s_prime))
        if interactive_fn:
            interactive_fn(s, a)
        s = s_prime
    return reward, episode

# Return average reward for n_episodes of length episode_length
# while following policy (a function of state) to choose actions.


def evaluate(mdp, n_episodes, episode_length, policy):
    score = 0
    length = 0
    for i in range(n_episodes):
        # Accumulate the episode rewards
        r, e = sim_episode(mdp, episode_length, policy)
        score += r
        length += len(e)
        # print('    ', r, len(e))
    return score / n_episodes, length / n_episodes


def Q_learn_batch(mdp, q, lr=.1, iters=100, eps=0.5, episode_length=10, n_episodes=2, interactive_fn=None):
    g = mdp.discount_factor
    e = []

    for i in range(iters):
        if interactive_fn:
            interactive_fn(q, i)

        for j in range(n_episodes):
            _, ep = sim_episode(mdp, episode_length,
                                lambda x: epsilon_greedy(q, x, eps))
            e.extend(ep)

        gen = [(s, a, r + (g * value(q, ns) if ns != None else 0))
               for s, a, r, ns in e]
        q.update(gen, lr)

    return q


def make_nn(state_dim, num_hidden_layers, num_units):
    model = Sequential()
    model.add(Dense(num_units, input_dim=state_dim, activation='relu'))
    for i in range(num_hidden_layers - 1):
        model.add(Dense(num_units, activation='relu'))
    model.add(Dense(1, activation='linear'))
    model.compile(loss='mse', optimizer=Adam())
    return model


class NNQ:
    def __init__(self, states, actions, state2vec, num_layers, num_units, epochs=1):
        self.actions = actions
        self.states = states
        self.epochs = epochs
        self.state2vec = state2vec
        state_dim = state2vec(states[0]).shape[1]  # a row vector
        self.models = {a: make_nn(state_dim, num_layers, num_units) for
                       a in actions}

    def get(self, s, a):
        return self.models[a].predict(self.state2vec(s))

    def update(self, data, lr):
        for a in self.actions:
            if [s for (s, at, t) in data if a == at]:
                X = np.vstack([self.state2vec(s)
                               for (s, at, t) in data if a == at])
                Y = np.vstack([np.array([float(t)])
                               for (s, at, t) in data if a == at])
                self.models[a].fit(X, Y, epochs=self.epochs, verbose=False)
