#include <unordered_map>
#include <vector>
#include <string>
#include <utility> // for std::pair

using namespace std;

class Graph {
public:
    struct Edge {
        string destination;
        double weight;
    };

    void addEdge(const string& src, const string& dest, double weight, bool bidirectional = true);
    void exportToFile(const string& filename) const;
    void setNodePosition(const string& node, double x, double y);

private:
    unordered_map<string, vector<Edge>> adjList;
    static unordered_map<string, pair<double, double>> nodePositions;
};
