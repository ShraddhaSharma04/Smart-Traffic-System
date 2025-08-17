#include "Graph.h"
#include <iostream>
#include <fstream>
#include <sstream>
#include <ctime>
#include <string>
#include <unordered_map>
#include <vector>

using namespace std;

vector<string> splitByWhitespace(const string& line) {
    istringstream iss(line);
    vector<string> tokens;
    string token;
    while (iss >> token) {
        tokens.push_back(token);
    }
    return tokens;
}

bool parseTimeSlot(const string& slot, int& startHour, int& endHour) {
    size_t dashPos = slot.find('-');
    if (dashPos == string::npos) return false;
    try {
        startHour = stoi(slot.substr(0, dashPos));
        endHour = stoi(slot.substr(dashPos + 1));
        if (startHour < 0 || startHour > 23 || endHour < 0 || endHour > 24) return false;
        return true;
    } catch (...) {
        return false;
    }
}

bool isHourInSlot(int hour, int startHour, int endHour) {
    if (startHour < endHour) {
        return hour >= startHour && hour < endHour;
    } else {
        return hour >= startHour || hour < endHour;
    }
}

int main() {
    Graph graph;
    graph.setNodePosition("VND", 350, 420);
    graph.setNodePosition("RHS", 70, 160);
    graph.setNodePosition("NVFS", -150, 270);
    graph.setNodePosition("CBG", 0, 0);
    graph.setNodePosition("GEU", -210, 50);
    graph.setNodePosition("GEHU", -120, -50);
    graph.setNodePosition("VM", 140, 80);
    graph.setNodePosition("RDWD", 60, -330);
    graph.setNodePosition("TSDM", -190, -100);
    graph.setNodePosition("ASAR", -60, -250);
    graph.setNodePosition("ISBT", -210, -450);

    graph.setNodePosition("VND1", 320, 400);
    graph.setNodePosition("VND2", 350, 330);
    graph.setNodePosition("VND3", 310, 320);
    graph.setNodePosition("VND4", 210, 320);

    graph.setNodePosition("RHS1", 50, 190);
    graph.setNodePosition("RHS2", 20, 160);
    graph.setNodePosition("RHS3", -30, 210);
    graph.setNodePosition("RHS4", -80, 240);

    graph.setNodePosition("NVFS1", -170, 230);
    graph.setNodePosition("NVFS2", -120, 200);

    graph.setNodePosition("CBG1", 65, 40);
    graph.setNodePosition("CBG2", 110, 10);
    graph.setNodePosition("CBG3", 110, 80);
    graph.setNodePosition("CBG4", 10, -60);
    graph.setNodePosition("CBG5", -20, -110);

    graph.setNodePosition("GEU1", -140, 20);
    graph.setNodePosition("GEU2", -170, 10);

    graph.setNodePosition("VM1", 80, -200);
    graph.setNodePosition("VM2", 130, -270);

    graph.setNodePosition("RDWD1", 30, -290);
    graph.setNodePosition("RDWD2", -10, -340);
    graph.setNodePosition("RDWD3", -40, -320);
    graph.setNodePosition("RDWD4", -10, -280);

    graph.setNodePosition("TSDM1", -130, -120);
    graph.setNodePosition("ASAR1", -220, -370);

    time_t now = time(nullptr);
    tm *ltm = localtime(&now);
    int currentHour = ltm->tm_hour;

    ifstream file("C:\\Users\\dell\\OneDrive\\Documents\\DAA_Smart_Traffic_System_Project\\SmartTrafficSystem\\Traffic_Data_Real.txt");
    if (!file) {
        cerr << "Unable to open Traffic Data file\n";
        return 1;
    }

    unordered_map<string, int> edgeWeights;
    string line, currentEdge;

    while (getline(file, line)) {
        if (line.empty()) continue;

        vector<string> parts = splitByWhitespace(line);
        if (parts.empty()) continue;

        // Determine if this line starts with an edge or a time slot
       int startHour, endHour;

if (parts.size() >= 2 && parseTimeSlot(parts[0], startHour, endHour)) {
    // time slot line - edge continues from previous line
    if (currentEdge.empty()) continue;
    if (!isHourInSlot(currentHour, startHour, endHour)) continue;

    int weight;
    try {
        weight = stoi(parts[1]);
    } catch (...) {
        continue;
    }
    edgeWeights[currentEdge] = weight;

} else if (parts.size() >= 3 && parts[0].find('-') != string::npos) {
    // edge line with time slot and weight
    currentEdge = parts[0];

    if (!parseTimeSlot(parts[1], startHour, endHour)) continue;
    if (!isHourInSlot(currentHour, startHour, endHour)) continue;

    int weight;
    try {
        weight = stoi(parts[2]);
    } catch (...) {
        continue;
    }
    edgeWeights[currentEdge] = weight;
}

    }

    for (const auto& [edge, weight] : edgeWeights) {
        size_t dashPos = edge.find('-');
        if (dashPos == string::npos) continue;

        string u = edge.substr(0, dashPos);
        string v = edge.substr(dashPos + 1);

        graph.addEdge(u, v, weight, true);
    }

    graph.exportToFile("graph.txt");
    return 0;
}
