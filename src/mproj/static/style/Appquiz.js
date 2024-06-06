document.addEventListener('DOMContentLoaded', function() {
    const quizContainer = document.getElementById('quiz-container');
    const quizHeader = document.getElementById('quiz-header');
    const progress = document.querySelector('.progress-bar');
    const letsGoBtn = document.getElementById('letsGoBtn');
    const cardFooter = document.getElementById('cardFooter');

    // Sample questions and answers
    // Your existing questions and answers...


    const questions = [
        {
            question: "Imagine you had ₹100 in a savings account with an interest rate of 2% per year. After 5 years, how much would you have in the account if you left the money to grow?",
            options: ["Exactly ₹102", "More than ₹102", "Less than ₹102"],
            correctAnswer: "B"
        },
        {
            question: "If the interest rate on your savings account was 1% per year and inflation was 2% per year, after 1 year, would you be able to buy:",
            options: ["Exactly the same as today", "More than today", "Less than today"],
            correctAnswer: "C"
        },
        {
            question: "True or false: Buying a single company stock usually provides a safer return than a stock mutual fund.",
            options: ["True", "False"],
            correctAnswer: "B"
        },
        {
            question: "What is the primary purpose of creating a budget?",
            options: ["To track daily spending habits", "To allocate income for various expenses and savings goals", "To maximize credit card rewards"],
            correctAnswer: "B"
        },
        {
            question: "Which of the following best describes the concept of interest?",
            options: ["The cost of borrowing money or the reward for saving money", "The price of goods and services", "The amount of money spent on daily expenses"],
            correctAnswer: "A"
        },
        {
            question: "What are assets, liabilities, and equity in financial terms?",
            options: [
                "Assets are what a company owns, liabilities are what it owes, and equity is the company's overall value.",
                "Assets are things that add value to a company, like cash or equipment. Liabilities are what the company owes, like loans. Equity is the difference between assets and liabilities.",
                "Assets are the money a company makes, liabilities are its expenses, and equity is its profit."
            ],
            correctAnswer: "B"
        },
        {
            question: "How does insurance help individuals manage financial risks?",
            options: ["By providing protection against unexpected expenses", "By reducing daily expenses", "By increasing one's credit score"],
            correctAnswer: "A"
        },
        {
            question: "What is the role of diversification in investment portfolios?",
            options: ["To increase risk by investing in a single asset class", "To maximize short-term gains", "To reduce risk by investing in a variety of assets"],
            correctAnswer: "C"
        },
        {
            question: "What are the potential benefits of saving for retirement at an early age?",
            options: ["Retirement savings can only be used after reaching a certain age", "Compound interest can help savings grow over time", "Retirement savings are not subject to taxes"],
            correctAnswer: "B"
        },
        {
            question: "How does inflation impact the purchasing power of money over time?",
            options: ["Inflation reduces the purchasing power of money", "Inflation increases the purchasing power of money", "Inflation has no impact on the purchasing power of money"],
            correctAnswer: "A"
        },
        {
            question: "What is the purpose of establishing an emergency fund?",
            options: ["To invest in high-risk assets for potential high returns", "To save for short-term goals", "To cover unexpected expenses and avoid debt"],
            correctAnswer: "C"
        },
        {
            question: "How can individuals protect themselves from financial fraud?",
            options: ["By verifying the legitimacy of financial institutions and transactions", "By avoiding financial planning altogether", "By sharing personal and financial information online"],
            correctAnswer: "A"
        },
        {
            question: "You have a credit card with a 20% annual interest rate. If you only make the minimum payments each month, what is likely to happen to your debt over time?",
            options: ["It will stay the same", "It will decrease steadily", "It will increase significantly"],
            correctAnswer: "C"
        },
        {
            question: "You receive a job offer with a higher salary but longer commuting distance. How might this impact your overall financial situation?",
            options: ["It could decrease your expenses due to the higher salary", "It could increase your expenses due to commuting costs", "It will have no impact on your finances"],
            correctAnswer: "B"
        },
        {
            question: "When comparing two loan options, what factors should you consider besides the interest rate?",
            options: ["The reputation and reliability of the lender", "The popularity of the loan option on social media", "The loan term and any additional fees"],
            correctAnswer: "A"
        }
    ];


    let currentQuestionIndex = 0;
    let score = 0;

    // Function to display current question
    function displayQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        quizHeader.textContent = `Question ${currentQuestionIndex + 1}`;
        quizContainer.innerHTML = `
            <p>${currentQuestion.question}</p>
            ${currentQuestion.options.map((option, index) => `
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="quizOption" id="option${index}" value="${String.fromCharCode(65 + index)}">
                    <label class="form-check-label" for="option${index}">
                        ${option}
                    </label>
                </div>
            `).join('')}
        `;  

    }

    // Function to handle option selection
    function handleOptionSelection() {
        const selectedOption = document.querySelector('input[name="quizOption"]:checked');
        if (!selectedOption) return; // If no option selected, exit
        const selectedAnswer = selectedOption.value;

        // Check if the selected answer is correct
        if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
            score++;
        }

        // Move to the next question or show result if all questions answered
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
            updateProgress();
        } else {
            // Calculate score percentage
            const scorePercentage = (score / questions.length) * 100;
            let qualificationMessage;
            
            btnFooter.style.display = 'block';
            progressfooter.style.display = 'none';



            // Determine qualification message based on score
            if (scorePercentage >= 70) {
                qualificationMessage = "You likely have a good understanding of financial concepts and can proceed to intermediate topics.";
            } else if (scorePercentage >= 50) {
                qualificationMessage = "You may need more education on financial concepts and should start with beginner topics.";
            } else {
                qualificationMessage = "You may need significant education on financial concepts and should start with basic topics.";
            }

            // Display result
            quizHeader.textContent = `Result (${Math.round(scorePercentage)}%)`;
            quizContainer.innerHTML = `
                <p>You scored ${score}/${questions.length}</p>
                <p>${qualificationMessage}</p>
            `;
            // Enable "Let's Go" button and show progress bar
            progress.parentElement.style.display = 'block';
            letsGoBtn.classList.remove('disabled');
        }
    }

    // Function to update progress bar
    function updateProgress() {
        const progressValue = ((currentQuestionIndex + 1) / questions.length) * 100;
        progress.style.width = progressValue + '%';
    }

    // Event listener for option selection
    quizContainer.addEventListener('change', handleOptionSelection);

    // Display the first question
    displayQuestion();
});


