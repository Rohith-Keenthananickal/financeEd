function showSidebar(){
    const sidebar = document.querySelector('.sidebar')

    sidebar.style.display = 'flex'

}


function hideSidebar(){
    const sidebar = document.querySelector('.sidebar')

    sidebar.style.display = 'none'
}











function spark(event){
    let i = document.createElement('i');
    i.style.left = (event.pageX) + 'px';
    i.style.top = (event.pageY) + 'px';
    i.style.scale = `${Math.random() * 2 + 1}`;
    i.style.setProperty('--x', getRandomTransitionValue());
    i.style.setProperty('--y', getRandomTransitionValue());
    document.body.appendChild(i);
    setTimeout(() => {
        document.body.removeChild(i);
    }, 2000)
}

function getRandomTransitionValue(){
    return `${Math.random() * 201 - 200}px`;
}

document.addEventListener('mousemove', spark);



















function submitQuiz() {
    // Array to store correct answers
    const correctAnswers = ['b', 'b', 'b', 'b', 'c'];

    // Get all selected options
    const selectedOptions = document.querySelectorAll('input[type="radio"]:checked');

    // Array to store user answers
    const userAnswers = [];

    // Loop through selected options and extract user answers
    selectedOptions.forEach(option => {
        userAnswers.push(option.value);
    });

    // Compare user answers with correct answers
    let score = 0;
    for (let i = 0; i < correctAnswers.length; i++) {
        if (userAnswers[i] === correctAnswers[i]) {
            score++;
        }
    }

    // Display result
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.style.display = 'block';
    const resultText = document.getElementById('resultText');
    resultText.textContent = `You scored ${score} out of ${correctAnswers.length}`;


     // Show retry button
     const retryBtn = document.getElementById('retryBtn');
     retryBtn.style.display = 'inline-block';

// Scroll to the quiz section
    const quizSection = document.getElementById('quizSection');
    quizSection.scrollIntoView({ behavior: 'smooth' });
}

// Add event listener to the submit button
document.getElementById('submitBtn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default form submission
    submitQuiz();
});




document.getElementById('retryBtn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default form submission
    // Reset quiz
    document.getElementById('quizForm').reset();
    document.getElementById('resultContainer').style.display = 'none';
});