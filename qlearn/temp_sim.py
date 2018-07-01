import numpy as np
import matplotlib.pyplot as plt
import dist
import util
from mdp10 import MDP, TabularQ, NNQ, value_iteration, Q_learn, Q_learn_batch, greedy, sim_episode, evaluate

# OMEGALUL
# ttmp -> tactmp


def bound(val, btm, top):
    return min(top, max(btm, val))


# All temperatures in celcius
minT, maxT = 19, 31
etmp = 36

# Scale all temperature values by u to enlarge discrete state space if needed
u = 1

minT *= u
maxT *= u
etmp *= u


def emulate(game, q, episode_length, num_episodes=1):
    for i in range(num_episodes):
        reward, _ = sim_episode(game, episode_length,
                                lambda s: greedy(q, s), interactive_fn=print)
        print('Reward', reward)


class TempSim(MDP):
    def __init__(self, start=(20*u, 25*u, 30*u, False)):
        self.q = None
        self.discount_factor = 0.99

        # +1 so that range is inclusive
        self.states = [
            (itmp, ttmp, actmp, acst)
            for itmp in range(minT, maxT + 1)
            for ttmp in range(minT, maxT + 1)
            for actmp in range(minT, maxT + 1)
            for acst in (True, False)
        ]
        # self.states.append('over')

        self.actions = [
            +1,
            0,
            -1,
            np.nextafter(0, 1),  # keep AC on (!= 0) but do not move target
        ]

        self.start = dist.delta_dist(start)

        # self.start = dist.uniform_dist([((br, 0), (0, 1), 0, 0)
        #                                 for br in range(self.n)]) \
        #     if random_start else  \
        #     dist.delta_dist(((int(self.n / 2), 0), (0, 1), 0, 0))

    def state2vec(self, s):
        (itmp, ttmp, actmp, acst) = s
        return np.array([[itmp, ttmp, actmp, acst]])

    def terminal(self, s):
        return False

    def reward_fn(self, s, a):
        (itmp, ttmp, actmp, acst) = s

        delta = (itmp - ttmp) / u

        reward = - delta ** 2
        if acst:
            # cooling is expensive
            if etmp > itmp and actmp < itmp:
                reward *= 1.1

            # heating is not as expensive
            if etmp < itmp and actmp > itmp:
                reward *= 1.02
        elif abs(delta) < 1:
            reward /= 1.2

        # print(s, a, reward)
        return reward

    def transition_model(self, s, a):
        # Current state
        (itmp, ttmp, actmp, acst) = s

        # Nominal next state
        al_on = 0.5
        al_of = 0.9

        if acst:
            itmp = al_on * itmp + (1 - al_on) * actmp
        else:
            itmp = al_of * itmp + (1 - al_of) * etmp

        actmp += a
        actry = (a != 0)

        itmp = r_stvar(bound(itmp, minT, maxT))
        actmp = r_stvar(bound(actmp, minT, maxT))

        if actry != acst:
            mpr = (itmp, ttmp, actmp, acst)
            ipr = (itmp, ttmp, actmp, actry)

            pr = 0.5
            return dist.DDist({mpr: 1 - pr, ipr: pr})

        new_s = (itmp, ttmp, actmp, acst)
        return dist.delta_dist(new_s)

    def draw_state(self, s):
        print(s)


def test_learn_play(game=None, q=None, num_layers=2, num_units=100,
                    eps=0.5, iters=10000, draw=False,
                    tabular=True, batch=False, batch_epochs=10,
                    num_episodes=2, episode_length=500):
    iters_per_value = 1 if iters <= 10 else int(iters / 10.0)
    scores = []

    def interact(q, iter=0):
        if iter % iters_per_value == 0:
            scores.append((iter, evaluate(game, num_episodes, episode_length,
                                          lambda s: greedy(q, s))[0]))
            print('score', scores[-1])

    if not game:
        game = TempSim()

    global r_stvar
    if not q:
        if tabular:
            r_stvar = round
            q = TabularQ(game.states, game.actions)
        else:
            r_stvar = float
            q = NNQ(game.states, game.actions, game.state2vec, num_layers, num_units,
                    epochs=batch_epochs if batch else 1)


    try:
        if batch:
            qf = Q_learn_batch(game, q, iters=iters, episode_length=100, n_episodes=10,
                               eps=eps, interactive_fn=interact)
        else:
            qf = Q_learn(game, q, iters=iters, eps=eps, interactive_fn=interact)
    except KeyboardInterrupt:
        pass

    emulate(game, q, episode_length=episode_length)

    return game, q


def test_solve_play(d=6, draw=False,
                    num_episodes=10, episode_length=100):
    game = TempSim()
    qf = value_iteration(game, TabularQ(game.states, game.actions))
    for i in range(num_episodes):
        reward, _ = sim_episode(game, (episode_length if d > 5 else episode_length / 2),
                                lambda s: greedy(qf, s), draw=draw)
        print('Reward', reward)

# Test cases

# Value Iteration
# test_solve_play()
# Q-learn
# test_learn_play(iters=100000, tabular=True, batch=False)
# Batch Q-learn
# test_learn_play(iters=10, tabular=True, batch=True) # Check: why do we want fewer iterations here?
# NN Q-learn
# test_learn_play(iters=100000, tabular=False, batch=False)
# Fitted Q
# test_learn_play(iters=10, tabular=False, batch=True)

game = None
q = None
