#include "Graph.h"
#include <set>
#include <iostream>
#include <stack>
#include <algorithm>
#include <fstream>
#include <queue>
#include <limits>

using namespace std;

void Graph::addEdge(const string& src, const string& dest, double weight, bool bidirectional) {
    adjList[src].push_back({dest, weight});
    if (bidirectional) {
        adjList[dest].push_back({src, weight});
    }
}

void Graph::exportToFile(const string& filename) const {
    ofstream outFile(filename);
    if (!outFile) {
        cerr << "Error opening file: " << filename << endl;
        return;
    }

    outFile << "# Nodes\n";
    for (const auto& pair : nodePositions) {
        outFile << pair.first << " " << pair.second.first << " " << pair.second.second << "\n";
    }

    outFile << "\n# Edges\n";
    set<pair<string, string>> written;//To Make sure undirected edges dont get written twice

    for (const auto& pair : adjList) {
        const string& src = pair.first;
        for (const Edge& edge : pair.second) {
            string a = src;
            string b = edge.destination;
            if (a > b) swap(a, b);
            if (written.count({a, b}) == 0) {
                outFile << a << " " << b << " " << edge.weight << "\n";
                written.insert({a, b});
            }
        }
    }

    outFile.close();
}

void Graph::setNodePosition(const string& node, double x, double y) {
    nodePositions[node] = {x, y};
}

unordered_map<string, pair<double, double>> Graph::nodePositions;
