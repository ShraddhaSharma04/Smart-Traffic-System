import networkx as nx
import matplotlib.pyplot as plt

G = nx.Graph()
positions = {}
reading_nodes = True

with open("graph.txt", "r") as file:
    for line in file:
        line = line.strip()
        if not line or line.startswith("#"):
            if "# Edges" in line:
                reading_nodes = False
            continue
        parts = line.split()
        if reading_nodes:
            if len(parts) == 3:
                node, x, y = parts
                try:
                    positions[node] = (float(x), float(y))
                    G.add_node(node)
                except ValueError:
                    print(f"Invalid position data: {line}")
        else:
            if len(parts) == 3:
                src, dest, weight = parts
                try:
                    G.add_edge(src, dest, weight=float(weight))
                except ValueError:
                    print(f"Invalid edge data: {line}")

main_nodes = [node for node in G.nodes if not node[-1].isdigit()]
inter_nodes = [node for node in G.nodes if node[-1].isdigit()]

nx.draw_networkx_nodes(G, pos=positions, nodelist=main_nodes, node_size=300, node_color='skyblue', node_shape='o')
nx.draw_networkx_nodes(G, pos=positions, nodelist=inter_nodes, node_size=30, node_color='skyblue', node_shape='D')

nx.draw_networkx_edges(G, pos=positions, edge_color='gray')

main_labels = {node: node for node in main_nodes}
nx.draw_networkx_labels(G, pos=positions, labels=main_labels, font_weight='bold', font_size=8)

edge_labels = nx.get_edge_attributes(G, 'weight')
nx.draw_networkx_edge_labels(G, pos=positions, edge_labels=edge_labels, font_size=7)

plt.title("Smart Traffic System Road Graph")
plt.axis('off')
plt.tight_layout()
plt.show()
