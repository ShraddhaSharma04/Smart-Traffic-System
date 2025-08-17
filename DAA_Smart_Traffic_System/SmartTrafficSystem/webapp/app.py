from flask import Flask, render_template, request, redirect, url_for, flash
import networkx as nx
import matplotlib.pyplot as plt
import io
import base64

app = Flask(__name__)
app.secret_key = 'your_secret_key'

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
    node_colors_main = ['lightgreen' if node in path else 'skyblue' for node in main_nodes]
    node_colors_inter = ['lightgreen' if node in path else 'skyblue' for node in inter_nodes]
    plt.figure(figsize=(10, 7))
    nx.draw_networkx_nodes(G, pos, nodelist=main_nodes, node_size=300, node_color=node_colors_main, node_shape='o')
    nx.draw_networkx_nodes(G, pos, nodelist=inter_nodes, node_size=30, node_color=node_colors_inter, node_shape='D')
    nx.draw_networkx_edges(G, pos, edge_color=edge_colors, width=2)
    main_labels = {node: node for node in main_nodes}
    nx.draw_networkx_labels(G, pos, labels=main_labels, font_weight='bold', font_size=8)
    edge_labels = nx.get_edge_attributes(G, 'weight')
    nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels, font_size=7)
    plt.title(f"Shortest Path from {path[0]} to {path[-1]}\nTime: {total_time}")
    plt.axis('off')
    plt.tight_layout()
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    plt.close()
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    return img_base64

@app.route('/', methods=['GET', 'POST'])
def index():
    G, positions = read_graph_from_file('..//graph.txt')
    nodes = sorted(G.nodes)
    if request.method == 'POST':
        start = request.form.get('start')
        end = request.form.get('end')
        if not start or not end:
            flash('Please select both start and end locations.')
            return redirect(url_for('index'))
        try:
            path, total_time = find_shortest_path(G, start, end)
            img_data = draw_path(G, positions, path, total_time)
            return render_template('result.html', path=path, total_time=total_time, img_data=img_data, start=start, end=end)
        except nx.NetworkXNoPath:
            flash('No path exists between the selected nodes.')
        except nx.NodeNotFound as e:
            flash(str(e))
        return redirect(url_for('index'))
    return render_template('index.html', nodes=nodes)

if __name__ == '__main__':
    app.run(debug=True) 