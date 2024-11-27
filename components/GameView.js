import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig"; // Adjust path if needed

export default function MathGame() {
  const [numbers, setNumbers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sum, setSum] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [message, setMessage] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [userScore, setUserScore] = useState(0);

  const user = getAuth().currentUser;

  useEffect(() => {
    if (user) {
      const fetchUserScore = async () => {
        try {
          const userDoc = await getDoc(doc(firestore, "users", user.uid));
          if (userDoc.exists()) {
            setUserScore(userDoc.data().score || 0);
          }
        } catch (error) {
          console.error("Error fetching user score: ", error);
        }
      };

      fetchUserScore();
    }
  }, [user]);

  useEffect(() => {
    if (currentIndex < numbers.length) {
      const timer = setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else if (numbers.length > 0) {
      setShowInput(true);
    }
  }, [currentIndex, numbers]);

  const startGame = () => {
    setGameStarted(true);
    generateRandomNumbers();
  };

  const generateRandomNumbers = () => {
    const nums = [];
    let previousNum = null;

    for (let i = 0; i < 10; i++) {
      let newNum;
      do {
        newNum = Math.floor(Math.random() * 10);
      } while (newNum === previousNum);
      nums.push(newNum);
      previousNum = newNum;
    }

    setNumbers(nums);
    setSum(nums.reduce((acc, num) => acc + num, 0));
    setCurrentIndex(0);
    setShowInput(false);
    setUserInput("");
    setMessage("");
  };

  const handleInputChange = (text) => {
    setUserInput(text);
  };

  const handleSubmit = async () => {
    const userSum = parseInt(userInput, 10);
    let newScore = userScore;

    if (userSum === sum) {
      setMessage("Točan odgovor, bravo samo tako nastavi!");
      newScore += 5; // Correct answer, +5 points
    } else {
      setMessage(`Netočan odgovor! Točan zbroj je ${sum}.`);
      newScore -= 7; // Incorrect answer, -7 points
    }

    setUserScore(newScore);
    await updateDoc(doc(firestore, "users", user.uid), { score: newScore });
  };

  return (
    <View style={styles.container}>
      {!gameStarted ? (
        <TouchableOpacity onPress={startGame} style={styles.startButton}>
          <Text style={styles.startText}>Započni igricu</Text>
        </TouchableOpacity>
      ) : currentIndex < numbers.length ? (
        <Text style={styles.number}>{numbers[currentIndex]}</Text>
      ) : showInput ? (
        <View style={styles.inputWrapper}>
          <Text style={styles.scoreText}>Trenutni score: {userScore}</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Unesite zbroj brojeva"
              style={styles.input}
              keyboardType="numeric"
              value={userInput}
              onChangeText={handleInputChange}
            />
            <TouchableOpacity onPress={handleSubmit} style={styles.iconButton}>
              <Icon name="checkmark-circle-outline" size={30} color="green" />
            </TouchableOpacity>
          </View>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <TouchableOpacity onPress={generateRandomNumbers} style={styles.restartButton}>
            <Icon name="refresh-outline" size={30} color="blue" />
            <Text style={styles.restartText}>Restart</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  number: {
    fontSize: 96,
    fontWeight: "bold",
    color: "#333",
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputWrapper: {
    width: "80%",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    textAlign: "center",
    marginRight: 10,
  },
  iconButton: {
    padding: 5,
  },
  message: {
    fontSize: 18,
    fontWeight: "bold",
    color: "blue",
    marginTop: 10,
  },
  restartButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  restartText: {
    fontSize: 18,
    color: "blue",
    marginLeft: 5,
  },
  startButton: {
    padding: 10,
    backgroundColor: "green",
    borderRadius: 5,
  },
  startText: {
    color: "white",
    fontSize: 18,
  },
});
