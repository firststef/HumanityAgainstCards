#include <iostream>
#include <vector>

using namespace std;

double probability = 0.3;

void trainDatabase(int answer);
int getAnswer(int blackCard, vector<int> whiteCards);

int main(int argc, char *argv[]) {
	
	if (argc < 2) //Wrong call
		return -1;

	char* functionName = argv[1];

	if (strcmp(functionName, "getProbability") == 0 )
		return (int)(100 * probability);
	if (strcmp(functionName, "setProbability") == 0) {
		if (argc < 3)
			return -2; //Not enough arguments
		probability = atoi(argv[2]);
		return 0;
	}
	if (strcmp(functionName, "trainAI") == 0) {
		if (argc < 4)
			return -2; //Not enough arguments

		int selectedCard = (atoi(argv[2]));
		vector<int> whiteCards;
		for (int i = 3; i < argc; i++)
			whiteCards.push_back(atoi(argv[i]));

		trainDatabase(selectedCard, whiteCards);
		return 0;
	}
	if (strcmp(functionName, "getAIAnswer") == 0) {
		if (argc < 4)
			return -2; //Not enough arguments
		int blackCard = atoi(argv[2]);
		vector<int> whiteCards;
		for (int i = 3; i < argc; i++)
			whiteCards.push_back(atoi(argv[i]));

		return getAnswer(blackCard, whiteCards);
	}
	return -3; //Unrecognized command
}

void trainDatabase(int selectedcard, vector<int> whiteCards) {
	//nothing here yet
}

int getAnswer(int blackCard, vector<int> whiteCards) {
	int answer = rand() % (whiteCards.size());
	return whiteCards[answer];
}