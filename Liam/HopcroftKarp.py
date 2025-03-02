import queue, math

dist = {}

# Based upon pseudocode from https://en.wikipedia.org/wiki/Hopcroft%E2%80%93Karp_algorithm
def BFS(G, U, pairU, pairV, dist):
    # Dictionary of distances

    # Empty queue
    q = queue.Queue()

    # Loop through the vertices on the left side of the bipartite graph
    for u in U:
        # If u is currently unmatched then we want to set its distance to 0 and add it to queue so we can try to find paths to unmatched vertices in V
        if pairU[u] == None:
            dist[u] = 0
            q.put(u)
        else:
            dist[u] = math.inf
    
    # Represents the distance of a supersink node and if there are no unmatched nodes in V then it will remain at infinity
    dist[None] = math.inf

    # Loop through the queue
    while not q.empty():
        # Dequeued value
        u = q.get()

        if dist[u] < dist[None]:
            for v in G[u]:
                if dist[pairV[v]] == math.inf:
                    dist[pairV[v]] = dist[u] + 1
                    q.put(pairV[v])

    # False if no paths are found, true otherwise
    return not dist[None] == math.inf

def DFS(u, dist, G, pairU, pairV):
    if not u == None:
        for v in G[u]:
            # Based on our run of DFS, this would indicate that v is part of the path from u
            if dist[pairV[v]] == dist[u] + 1:
                # Continue tracing the path to verify if its valid and if so update the matching
                if DFS(pairV[v], dist, G, pairU, pairV):
                    pairV[v] = u
                    pairU[u] = v
                    return True
        dist[u] = math.inf
        return False
    return True

def HopcroftKarp(G, U, V):
    pairU = {}
    pairV = {}
    matching = {}

    # Initialize all vertices in U and V as unmatched
    for u in U:
        pairU[u] = None
    for v in V:
        pairV[v] = None

    matchSize = 0
    # While there are still available paths
    while BFS(G, U, pairU, pairV, dist):
        for u in U:
            # If u is unmatched, we call DFS and increment the number of matches
            if pairU[u] == None:
                if DFS(u, dist, G, pairU, pairV):
                    matchSize += 1
    
    # Just creating a new dictionary matching which only contains matched u-v pairs
    for u in U:
        if not pairU[u] == None:
            matching[u] = pairU[u]
    
    return matching
    


