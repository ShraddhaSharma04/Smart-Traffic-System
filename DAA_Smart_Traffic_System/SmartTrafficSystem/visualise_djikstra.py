import networkx as nx
import matplotlib.pyplot as plt

def read_graph_from_file(filename):
    G = nx.Graph()
    positions = {}
    reading_nodes = True

    with open(filename, 'r') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                if "# Edges" in line:
                    reading_nodes = False
                continue

            parts = line.split()
            if reading_nodes and len(parts) == 3:
                node, x, y = parts
                positions[node] = (float(x), float(y))
                G.add_node(node)
            elif not reading_nodes and len(parts) == 3:
                src, dest, weight = parts
                G.add_edge(src, dest, weight=float(weight))

    return G, positions

def find_shortest_path(G, start, end):
    path = nx.dijkstra_path(G, start, end, weight='weight')
    length = nx.dijkstra_path_length(G, start, end, weight='weight')
    return path, length

def draw_path(G, pos, path, total_time):
    path_edges = list(zip(path, path[1:]))
    
    main_nodes = [node for node in G.nodes if not node[-1].isdigit()]
    inter_nodes = [node for node in G.nodes if node[-1].isdigit()]

    edge_colors = ['orange' if (u, v) in path_edges or (v, u) in path_edges else 'gray' for u, v in G.edges()]
    
    # Colors for nodes (highlight path in green)
    node_colors_main = ['lightgreen' if node in path else 'skyblue' for node in main_nodes]
    node_colors_inter = ['lightgreen' if node in path else 'skyblue' for node in inter_nodes]

    nx.draw_networkx_nodes(G, pos, nodelist=main_nodes, node_size=300, node_color=node_colors_main, node_shape='o')
    nx.draw_networkx_nodes(G, pos, nodelist=inter_nodes, node_size=30, node_color=node_colors_inter, node_shape='D')

    nx.draw_networkx_edges(G, pos, edge_color=edge_colors, width=2)

    # Only show labels for main nodes
    main_labels = {node: node for node in main_nodes}
    nx.draw_networkx_labels(G, pos, labels=main_labels, font_weight='bold', font_size=8)

    edge_labels = nx.get_edge_attributes(G, 'weight')
    nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels, font_size=7)

    plt.title(f"Shortest Path from {path[0]} to {path[-1]}\nTime: {total_time}")
    plt.axis('off')
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    filename = "graph.txt"
    G, positions = read_graph_from_file(filename)

    start = input("Enter starting location: ").strip()
    end = input("Enter destination: ").strip()

    try:
        path, total_time = find_shortest_path(G, start, end)
        print("Shortest Path:", " -> ".join(path))
        print("Total Time:", total_time)
        draw_path(G, positions, path, total_time)
    except nx.NetworkXNoPath:
        print("No path exists between the selected nodes.")
    except nx.NodeNotFound as e:
        print(e)
