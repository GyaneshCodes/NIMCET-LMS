import mongoose from "mongoose";
import dotenv from "dotenv";
import { Topic } from "./model/Topic.model.js";
import Question from "./model/Question.model.js";

dotenv.config({ path: "./.env" });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Topic.deleteMany({});
    await Question.deleteMany({});
    console.log("Cleared existing data");

    // Create Topics
    const topics = await Topic.create([
      {
        topicId: 1,
        topicName: "Set Theory",
        description: "Basics of Sets, Relations and Functions",
        subjectBelongsTo: "Mathematics",
      },
      {
        topicId: 2,
        topicName: "Calculus",
        description: "Limits, Continuity, Differentiation and Integration",
        subjectBelongsTo: "Mathematics",
      },
      {
        topicId: 3,
        topicName: "Vectors",
        description: "Vector Algebra and 3D Geometry",
        subjectBelongsTo: "Mathematics",
      },
    ]);

    console.log("Topics created");

    // Create Questions for Set Theory
    // Use topics[0]._id directly
    const setTheoryQuestions = [
      {
        questionId: 101,
        questionText: "If A = {1, 2, 3} and B = {3, 4, 5}, what is A ∩ B?",
        options: [
          { text: "{1, 2}", value: "A", isCorrect: false },
          { text: "{3}", value: "B", isCorrect: true },
          { text: "{4, 5}", value: "C", isCorrect: false },
          { text: "{1, 2, 3, 4, 5}", value: "D", isCorrect: false },
        ],
        correctAnswer: "B",
        topicId: topics[0]._id,
        difficultyLevel: "Easy",
        explanation: "Intersection contains elements common to both sets.",
      },
      {
        questionId: 102,
        questionText: "The number of subsets of a set with n elements is:",
        options: [
          { text: "n", value: "A", isCorrect: false },
          { text: "2^n", value: "B", isCorrect: true },
          { text: "n^2", value: "C", isCorrect: false },
          { text: "n!", value: "D", isCorrect: false },
        ],
        correctAnswer: "B",
        topicId: topics[0]._id,
        difficultyLevel: "Medium",
        explanation: "The power set has 2^n elements.",
      },
      {
        questionId: 103,
        questionText: "If A = {1, 2} and B = {3, 4}, what is A ∪ B?",
        options: [
          { text: "{1, 2, 3, 4}", value: "A", isCorrect: true },
          { text: "{}", value: "B", isCorrect: false },
          { text: "{1, 2}", value: "C", isCorrect: false },
          { text: "{3, 4}", value: "D", isCorrect: false },
        ],
        correctAnswer: "A",
        topicId: topics[0]._id,
        difficultyLevel: "Easy",
        explanation: "Union contains all elements from both sets.",
      },
      {
        questionId: 104,
        questionText: "Which of the following is an empty set?",
        options: [
          { text: "{0}", value: "A", isCorrect: false },
          { text: "{}", value: "B", isCorrect: true },
          { text: "{∅}", value: "C", isCorrect: false },
          { text: "{null}", value: "D", isCorrect: false },
        ],
        correctAnswer: "B",
        topicId: topics[0]._id,
        difficultyLevel: "Easy",
        explanation: "{} or ∅ represents the empty set with no elements.",
      },
      {
        questionId: 105,
        questionText: "If A = {1, 2, 3} and B = {2, 3, 4}, what is A - B?",
        options: [
          { text: "{1}", value: "A", isCorrect: true },
          { text: "{4}", value: "B", isCorrect: false },
          { text: "{1, 4}", value: "C", isCorrect: false },
          { text: "{2, 3}", value: "D", isCorrect: false },
        ],
        correctAnswer: "A",
        topicId: topics[0]._id,
        difficultyLevel: "Medium",
        explanation: "Set difference A - B contains elements in A but not in B.",
      },
      {
        questionId: 106,
        questionText: "What is the cardinality of set {a, b, c, d}?",
        options: [
          { text: "3", value: "A", isCorrect: false },
          { text: "4", value: "B", isCorrect: true },
          { text: "16", value: "C", isCorrect: false },
          { text: "24", value: "D", isCorrect: false },
        ],
        correctAnswer: "B",
        topicId: topics[0]._id,
        difficultyLevel: "Easy",
        explanation: "Cardinality is the number of elements in the set.",
      },
      {
        questionId: 107,
        questionText: "Which set is a subset of {1, 2, 3}?",
        options: [
          { text: "{1, 4}", value: "A", isCorrect: false },
          { text: "{2, 3}", value: "B", isCorrect: true },
          { text: "{4, 5}", value: "C", isCorrect: false },
          { text: "{0, 1, 2, 3}", value: "D", isCorrect: false },
        ],
        correctAnswer: "B",
        topicId: topics[0]._id,
        difficultyLevel: "Easy",
        explanation: "A subset contains only elements from the original set.",
      },
      {
        questionId: 108,
        questionText: "If A = {x | x is an even number between 1 and 10}, what is A?",
        options: [
          { text: "{2, 4, 6, 8}", value: "A", isCorrect: true },
          { text: "{1, 3, 5, 7, 9}", value: "B", isCorrect: false },
          { text: "{2, 4, 6, 8, 10}", value: "C", isCorrect: false },
          { text: "{0, 2, 4, 6, 8}", value: "D", isCorrect: false },
        ],
        correctAnswer: "A",
        topicId: topics[0]._id,
        difficultyLevel: "Medium",
        explanation: "Even numbers between 1 and 10 are 2, 4, 6, and 8.",
      },
      {
        questionId: 109,
        questionText: "What is the complement of set A = {1, 2} in Universal set U = {1, 2, 3, 4}?",
        options: [
          { text: "{1, 2}", value: "A", isCorrect: false },
          { text: "{3, 4}", value: "B", isCorrect: true },
          { text: "{1, 2, 3, 4}", value: "C", isCorrect: false },
          { text: "{}", value: "D", isCorrect: false },
        ],
        correctAnswer: "B",
        topicId: topics[0]._id,
        difficultyLevel: "Medium",
        explanation: "Complement contains elements in U but not in A.",
      },
      {
        questionId: 110,
        questionText: "A Venn diagram is used to represent:",
        options: [
          { text: "Relations between sets", value: "A", isCorrect: true },
          { text: "Functions", value: "B", isCorrect: false },
          { text: "Sequences", value: "C", isCorrect: false },
          { text: "Matrices", value: "D", isCorrect: false },
        ],
        correctAnswer: "A",
        topicId: topics[0]._id,
        difficultyLevel: "Easy",
        explanation: "Venn diagrams visually represent set relationships.",
      },
    ];

    // Create Questions for Calculus
    // Use topics[1]._id directly
    const calculusQuestions = [
      {
        questionId: 201,
        questionText: "Limit of (sin x)/x as x approaches 0 is:",
        options: [
          { text: "0", value: "A", isCorrect: false },
          { text: "1", value: "B", isCorrect: true },
          { text: "Infinity", value: "C", isCorrect: false },
          { text: "Undefined", value: "D", isCorrect: false },
        ],
        correctAnswer: "B",
        topicId: topics[1]._id,
        difficultyLevel: "Easy",
        explanation: "Standard limit.",
      },
      {
        questionId: 202,
        questionText: "The derivative of x^2 is:",
        options: [
          { text: "x", value: "A", isCorrect: false },
          { text: "2x", value: "B", isCorrect: true },
          { text: "x^2", value: "C", isCorrect: false },
          { text: "2x^2", value: "D", isCorrect: false },
        ],
        correctAnswer: "B",
        topicId: topics[1]._id,
        difficultyLevel: "Easy",
        explanation: "Using power rule: d/dx(x^n) = n*x^(n-1).",
      },
      {
        questionId: 203,
        questionText: "The integral of 1/x dx is:",
        options: [
          { text: "x^2", value: "A", isCorrect: false },
          { text: "ln|x| + C", value: "B", isCorrect: true },
          { text: "1/x^2", value: "C", isCorrect: false },
          { text: "e^x + C", value: "D", isCorrect: false },
        ],
        correctAnswer: "B",
        topicId: topics[1]._id,
        difficultyLevel: "Medium",
        explanation: "Standard integral formula.",
      },
      {
        questionId: 204,
        questionText: "What is d/dx(e^x)?",
        options: [
          { text: "e^x", value: "A", isCorrect: true },
          { text: "x*e^(x-1)", value: "B", isCorrect: false },
          { text: "e", value: "C", isCorrect: false },
          { text: "1", value: "D", isCorrect: false },
        ],
        correctAnswer: "A",
        topicId: topics[1]._id,
        difficultyLevel: "Easy",
        explanation: "Derivative of e^x is e^x itself.",
      },
      {
        questionId: 205,
        questionText: "The derivative of sin(x) is:",
        options: [
          { text: "-cos(x)", value: "A", isCorrect: false },
          { text: "cos(x)", value: "B", isCorrect: true },
          { text: "sin(x)", value: "C", isCorrect: false },
          { text: "-sin(x)", value: "D", isCorrect: false },
        ],
        correctAnswer: "B",
        topicId: topics[1]._id,
        difficultyLevel: "Easy",
        explanation: "Standard derivative.",
      },
      {
        questionId: 206,
        questionText: "What is the second derivative of x^3?",
        options: [
          { text: "3x^2", value: "A", isCorrect: false },
          { text: "6x", value: "B", isCorrect: true },
          { text: "6", value: "C", isCorrect: false },
          { text: "x^2", value: "D", isCorrect: false },
        ],
        correctAnswer: "B",
        topicId: topics[1]._id,
        difficultyLevel: "Medium",
        explanation: "First derivative is 3x^2, second is 6x.",
      },
      {
        questionId: 207,
        questionText: "The limit of 1/x as x approaches infinity is:",
        options: [
          { text: "Infinity", value: "A", isCorrect: false },
          { text: "0", value: "B", isCorrect: true },
          { text: "1", value: "C", isCorrect: false },
          { text: "Undefined", value: "D", isCorrect: false },
        ],
        correctAnswer: "B",
        topicId: topics[1]._id,
        difficultyLevel: "Medium",
        explanation: "As x grows, 1/x approaches 0.",
      },
      {
        questionId: 208,
        questionText: "What is ∫ x dx?",
        options: [
          { text: "x^2/2 + C", value: "A", isCorrect: true },
          { text: "x^2 + C", value: "B", isCorrect: false },
          { text: "1 + C", value: "C", isCorrect: false },
          { text: "x + C", value: "D", isCorrect: false },
        ],
        correctAnswer: "A",
        topicId: topics[1]._id,
        difficultyLevel: "Easy",
        explanation: "Using power rule for integration.",
      },
      {
        questionId: 209,
        questionText: "A function is continuous at x=a if:",
        options: [
          { text: "lim(x→a) f(x) = f(a)", value: "A", isCorrect: true },
          { text: "f(a) exists", value: "B", isCorrect: false },
          { text: "lim(x→a) f(x) exists", value: "C", isCorrect: false },
          { text: "f'(a) exists", value: "D", isCorrect: false },
        ],
        correctAnswer: "A",
        topicId: topics[1]._id,
        difficultyLevel: "Medium",
        explanation: "Continuity requires limit equals function value.",
      },
      {
        questionId: 210,
        questionText: "The derivative of ln(x) is:",
        options: [
          { text: "1/x", value: "A", isCorrect: true },
          { text: "x", value: "B", isCorrect: false },
          { text: "ln(x)", value: "C", isCorrect: false },
          { text: "e^x", value: "D", isCorrect: false },
        ],
        correctAnswer: "A",
        topicId: topics[1]._id,
        difficultyLevel: "Easy",
        explanation: "Standard derivative formula.",
      },
    ];

    // Create Questions for Vectors
    const vectorQuestions = [
      {
        questionId: 301,
        questionText: "If vector a = (1, 2, 3) and b = (4, 5, 6), what is a + b?",
        options: [
          { text: "(5, 7, 9)", value: "A", isCorrect: true },
          { text: "(3, 3, 3)", value: "B", isCorrect: false },
          { text: "(4, 10, 18)", value: "C", isCorrect: false },
          { text: "(1, 2, 3)", value: "D", isCorrect: false },
        ],
        correctAnswer: "A",
        topicId: topics[2]._id,
        difficultyLevel: "Easy",
        explanation: "Add corresponding components.",
      },
      {
        questionId: 302,
        questionText: "The magnitude of vector (3, 4) is:",
        options: [
          { text: "7", value: "A", isCorrect: false },
          { text: "5", value: "B", isCorrect: true },
          { text: "12", value: "C", isCorrect: false },
          { text: "1", value: "D", isCorrect: false },
        ],
        correctAnswer: "B",
        topicId: topics[2]._id,
        difficultyLevel: "Easy",
        explanation: "Magnitude = √(3² + 4²) = √25 = 5.",
      },
      {
        questionId: 303,
        questionText: "The dot product of (1, 0, 0) and (0, 1, 0) is:",
        options: [
          { text: "0", value: "A", isCorrect: true },
          { text: "1", value: "B", isCorrect: false },
          { text: "(1, 1, 0)", value: "C", isCorrect: false },
          { text: "undefined", value: "D", isCorrect: false },
        ],
        correctAnswer: "A",
        topicId: topics[2]._id,
        difficultyLevel: "Medium",
        explanation: "Perpendicular vectors have dot product 0.",
      },
      {
        questionId: 304,
        questionText: "A unit vector has magnitude:",
        options: [
          { text: "0", value: "A", isCorrect: false },
          { text: "1", value: "B", isCorrect: true },
          { text: "Variable", value: "C", isCorrect: false },
          { text: "Infinity", value: "D", isCorrect: false },
        ],
        correctAnswer: "B",
        topicId: topics[2]._id,
        difficultyLevel: "Easy",
        explanation: "Unit vectors always have magnitude 1.",
      },
      {
        questionId: 305,
        questionText: "If a = (2, 3) what is 3a?",
        options: [
          { text: "(6, 9)", value: "A", isCorrect: true },
          { text: "(5, 6)", value: "B", isCorrect: false },
          { text: "(2, 3)", value: "C", isCorrect: false },
          { text: "(6, 3)", value: "D", isCorrect: false },
        ],
        correctAnswer: "A",
        topicId: topics[2]._id,
        difficultyLevel: "Easy",
        explanation: "Multiply each component by the scalar.",
      },
      {
        questionId: 306,
        questionText: "Two vectors are parallel if their:",
        options: [
          { text: "Dot product is zero", value: "A", isCorrect: false },
          { text: "Cross product is zero", value: "B", isCorrect: true },
          { text: "Magnitudes are equal", value: "C", isCorrect: false },
          { text: "Sum is zero", value: "D", isCorrect: false },
        ],
        correctAnswer: "B",
        topicId: topics[2]._id,
        difficultyLevel: "Medium",
        explanation: "Parallel vectors have zero cross product.",
      },
      {
        questionId: 307,
        questionText: "The zero vector is denoted by:",
        options: [
          { text: "0", value: "A", isCorrect: false },
          { text: "(0, 0, 0)", value: "B", isCorrect: true },
          { text: "null", value: "C", isCorrect: false },
          { text: "∞", value: "D", isCorrect: false },
        ],
        correctAnswer: "B",
        topicId: topics[2]._id,
        difficultyLevel: "Easy",
        explanation: "Zero vector has all components as 0.",
      },
      {
        questionId: 308,
        questionText: "The dot product a·b equals:",
        options: [
          { text: "|a||b|cos(θ)", value: "A", isCorrect: true },
          { text: "|a||b|sin(θ)", value: "B", isCorrect: false },
          { text: "|a||b|", value: "C", isCorrect: false },
          { text: "a + b", value: "D", isCorrect: false },
        ],
        correctAnswer: "A",
        topicId: topics[2]._id,
        difficultyLevel: "Medium",
        explanation: "Dot product formula involves cosine of angle.",
      },
      {
        questionId: 309,
        questionText: "If a and b are perpendicular, then a·b =",
        options: [
          { text: "0", value: "A", isCorrect: true },
          { text: "1", value: "B", isCorrect: false },
          { text: "|a||b|", value: "C", isCorrect: false },
          { text: "90", value: "D", isCorrect: false },
        ],
        correctAnswer: "A",
        topicId: topics[2]._id,
        difficultyLevel: "Medium",
        explanation: "Perpendicular vectors have dot product = 0.",
      },
      {
        questionId: 310,
        questionText: "The position vector of origin is:",
        options: [
          { text: "(0, 0, 0)", value: "A", isCorrect: true },
          { text: "(1, 1, 1)", value: "B", isCorrect: false },
          { text: "undefined", value: "C", isCorrect: false },
          { text: "(0, 0)", value: "D", isCorrect: false },
        ],
        correctAnswer: "A",
        topicId: topics[2]._id,
        difficultyLevel: "Easy",
        explanation: "Origin has position vector (0, 0, 0).",
      },
    ];

    await Question.insertMany([...setTheoryQuestions, ...calculusQuestions, ...vectorQuestions]);
    console.log("Questions created");

    // Update Topic Stats
    for (const topic of topics) {
      await topic.updateStats();
    }
    console.log("Topic stats updated");

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
