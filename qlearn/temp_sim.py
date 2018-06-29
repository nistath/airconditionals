import pdb
import numpy as np
import matplotlib.pyplot as plt
import dist
import util
import pickle
from mdp10 import MDP, TabularQ, NNQ, value_iteration, Q_learn, Q_learn_batch, greedy, sim_episode, evaluate

# OMEGALUL
# etmp -> tttmp
def bound(val, btm, top):
    return min(top, max(btm, val))

minT, maxT = 10, 40

class TempSim(MDP):
    def __init__(self, start=(20, 25, 30)):
        self.q = None
        self.discount_factor = 0.9

        # +1 so that range is inclusive
        self.states = [
            (itmp, etmp, ttmp)
            for itmp in range(minT, maxT + 1)
            for etmp in range(minT, maxT + 1)
            for ttmp in range(minT, maxT + 1)
        ]
        self.states.append('over')

        self.actions = [
            +1,
            0,
            -1,
        ]

        self.start = dist.delta_dist(start)

        # self.start = dist.uniform_dist([((br, 0), (0, 1), 0, 0)
        #                                 for br in range(self.n)]) \
        #     if random_start else  \
        #     dist.delta_dist(((int(self.n / 2), 0), (0, 1), 0, 0))

    def state2vec(self, s):
        if state == 'over':
            ret = np.zeros((1, 4))
            ret[0][-1] = 1
            return ret

        (itmp, etmp, ttmp) = s
        return np.array([[itmp, etmp, ttmp, 0]])

    def terminal(self, state):
        return state == 'over'

    def reward_fn(self, s, a):
        print(s)
        if s == 'over':
            return 0

        (itmp, etmp, ttmp) = s
        return max(0.1, 100 - (itmp - etmp) ** 2)

    def transition_model(self, s, a):
        if s == 'over':
            return dist.delta_dist('over')

        # Current state
        (itmp, etmp, ttmp) = s

        # Nominal next state
        al = 0.5

        itmp = int(al * itmp + (1 - al) * ttmp)
        ttmp += a

        itmp = bound(itmp, minT, maxT)
        ttmp = bound(ttmp, minT, maxT)
        new_s = (itmp, etmp, ttmp)

        return dist.delta_dist(new_s)


def test_learn_play(d=6, num_layers=2, num_units=100,
                    eps=0.5, iters=10000, draw=False,
                    tabular=True, batch=False, batch_epochs=10,
                    num_episodes=10, episode_length=100):
    iters_per_value = 1 if iters <= 10 else int(iters / 10.0)
    scores = []

    def interact(q, iter=0):
        return
        if iter % iters_per_value == 0:
            scores.append((iter, evaluate(game, num_episodes, episode_length,
                                          lambda s: greedy(q, s))[0]))
            print('score', scores[-1])


    game = TempSim()
    if tabular:
        q = TabularQ(game.states, game.actions)
    else:
        q = NNQ(game.states, game.actions, game.state2vec, num_layers, num_units,
                epochs=batch_epochs if batch else 1)
    if batch:
        qf = Q_learn_batch(game, q, iters=iters, episode_length=100, n_episodes=10,
                           interactive_fn=interact)
    else:
        qf = Q_learn(game, q, iters=iters, interactive_fn=interact)
    for i in range(num_episodes):
        reward, _ = sim_episode(game, (episode_length if d > 5 else episode_length / 2),
                                lambda s: greedy(qf, s), draw=draw)
        print('Reward', reward)


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
