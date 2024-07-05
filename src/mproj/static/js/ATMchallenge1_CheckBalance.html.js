document.addEventListener('DOMContentLoaded', () => {
    const challengecontainer = document.getElementById('challenge-card');
    const atmContainer = document.getElementById('atm-container');
    const quizCard = document.getElementById('quiz-card');
    const option1 = document.getElementById('option1');
    const option2 = document.getElementById('option2');
    const feedback = document.getElementById('feedback');
    const cardAnimationContainer = document.getElementById('card-animation-container');
    const cardReaders = document.querySelectorAll('.card-reader, .card-reader1');
    const atmCard = document.querySelector('.card-animation-container img');
    const screenImage = document.getElementById('screen-image');
    const dialButtons = document.querySelectorAll('.dial-button');
    const pinInput = document.getElementById('pin-input');
    const clearButton = document.querySelector('.function-button.clear');
    const enterButton = document.querySelector('.function-button.enter');
    const transactionButtons = document.getElementById('transaction-buttons');
    const balanceInquiryButtons = document.querySelector('.balance-inquiry-buttons');
    const savingsButton = document.getElementById('savings');
    const quiz2Card = document.getElementById('quiz2-card');
    const option11 = document.getElementById('option11');
    const option22 = document.getElementById('option22');
    const option33 = document.getElementById('option33');



    const conclusion = document.getElementById('conclusion');


    let balanceflag = 0;
    let balanceflag2 = 0;
    let incorrectPinAttempts = 0;
    let isCardRemoved = false;
    let isCardInserted = false;
    let checkCardRemoval;



    function checkAndTriggerQuiz2() {
    if (balanceflag === 1 && balanceflag2 === 1) {
        setTimeout(() => {
            atmContainer.style.display = 'none';
            challengecontainer.style.display = 'none';
            conclusion.style.display = 'none'; 
            quiz2Card.style.display = 'flex';
        }, 1000);
    }
}

    savingsButton.addEventListener('click', () => {
        hideBalanceInquiryButtons();
        screenImage.src = 'FinTransaction_processing.gif';

        setTimeout(() => {
            screenImage.src = 'TransactionComplete.png';
            balanceflag = 1;

            setTimeout(() => {
                screenImage.src = 'TakeYourCard.png';
                resetBlinking();

                checkCardRemoval = setInterval(() => {
                    if (isCardRemoved) {
                        clearInterval(checkCardRemoval);
                        screenImage.src = 'Thankyou.png';

                        setTimeout(() => {
                            screenImage.src = 'ATMFinancEdWelcome.gif';
                            balanceflag2 = 1;
                            checkAndTriggerQuiz2(); // Check and trigger quiz when both flags are set

                            
                        }, 5000);
                    }
                }, 500);
            }, 3000);
        }, 6000);
    });

    hideTransactionButtons();
    hideBalanceInquiryButtons(); // Initially hide balance inquiry buttons

    clearButton.addEventListener('click', handleClearClick);
    enterButton.addEventListener('click', handleEnterClick);

    option1.addEventListener('click', () => {
        feedback.textContent = 'Wrong! Try again.';
        feedback.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
        feedback.style.display = 'block';
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 1000);
    });

    option2.addEventListener('click', () => {
        feedback.textContent = 'Correct! 😊';
        feedback.style.backgroundColor = 'rgba(0, 128, 0, 0.8)';
        feedback.style.display = 'block';
        setTimeout(() => {
            feedback.style.display = 'none';
            quizCard.style.display = 'none';

            conclusion.style.display = 'flex'; 

            atmContainer.style.display = 'flex';
            challengecontainer.style.display = 'block';
            cardAnimationContainer.style.display = 'block';
        }, 2000);

        setTimeout(() => {
            cardAnimationContainer.style.display = 'none';
            resetBlinking();
        }, 1000);
    });

    option11.addEventListener('click', () => {
        feedback.textContent = 'Wrong! Try again.';
        feedback.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
        feedback.style.display = 'block';
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 1000);
    });

    option22.addEventListener('click', () => {
        feedback.textContent = 'Wrong! Try again.';
        feedback.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
        feedback.style.display = 'block';
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 1000);
    });





    option33.addEventListener('click', () => {
        feedback.textContent = 'Excellent work! ✨😊✨';
        feedback.style.backgroundColor = 'rgba(0, 128, 0, 0.8)';
        feedback.style.display = 'block';
        
        setTimeout(() => {
            feedback.style.display = 'none';
            quiz2Card.style.display = 'none';
            atmContainer.style.display = 'flex';
            conclusion.style.display = 'flex'; 

            challengecontainer.style.display = 'block';
            cardAnimationContainer.style.display = 'block';
    
            setTimeout(() => {
                cardAnimationContainer.style.display = 'none';
                resetBlinking();
                showCompletedCard(); // Trigger showCompletedCard() function here
            }, 1000);
    
        }, 2000);
    });
    






    function handleCardReaderClick() {
        if (!isCardInserted) {
            insertCard();
        } else {
            removeCard();
        }
    }

    function insertCard() {
        cardAnimationContainer.style.display = 'block';
        atmCard.style.animation = 'slideUp 3s ease-in-out forwards';
        stopBlinkingAnimations();

        atmCard.addEventListener('animationend', () => {
            if (!isCardInserted) {
                atmCard.style.animation = '';
            }
        }, { once: true });

        setTimeout(() => {
            screenImage.src = 'DoNOTRemove-info.jpg';

            setTimeout(() => {
                screenImage.src = 'Enter_Your_Pin.gif';
                pinInput.style.display = 'block';
                pinInput.value = '';

                dialButtons.forEach(button => {
                    button.addEventListener('click', handleDialPadClick);
                });

                clearButton.addEventListener('click', handleClearClick);
                enterButton.addEventListener('click', handleEnterClick);
            }, 3000);
        }, 3000);

        isCardInserted = true;
    }

    function removeCard() {
        atmCard.style.animation = 'slideDown 2s ease-in-out forwards';

        atmCard.addEventListener('animationend', () => {
            cardAnimationContainer.style.display = 'none';
            atmCard.style.animation = '';
            resetBlinking();
            isCardRemoved = true; // Set flag here
        }, { once: true });

        isCardInserted = false;
    }

    function handleClearClick() {
        pinInput.value = '';
    }

    function handleDialPadClick(event) {
        const value = event.target.getAttribute('data-value');
        if (value && pinInput.value.length < 4) {
            pinInput.value += value;
            pinInput.type = 'password';
        }
    }

    function handleEnterClick() {
        if (pinInput.value.length === 4) {
            if (pinInput.value.trim() === '5165') {
                screenImage.src = 'Select_Transaction.jpg';
                showTransactionButtons();
            } else {
                showIncorrectPinScreen();
            }

            pinInput.style.display = 'none';

            dialButtons.forEach(button => {
                button.removeEventListener('click', handleDialPadClick);
            });

            clearButton.removeEventListener('click', handleClearClick);
            enterButton.removeEventListener('click', handleEnterClick);
        } else {
            showIncorrectPinScreen();
        }
    }

    function showIncorrectPinScreen() {
        incorrectPinAttempts += 1;
        pinInput.style.display = 'none';

        if (incorrectPinAttempts == 3) {
            screenImage.src = 'YourCardBlocked.png';
            setTimeout(() => {
                screenImage.src = 'TakeYourCard.png';
                resetBlinking();

                clearInterval(checkCardRemoval);  // Clear any existing interval before setting a new one
                checkCardRemoval = setInterval(() => {
                    if (isCardRemoved) {
                        clearInterval(checkCardRemoval);
                        screenImage.src = 'Thankyou.png';

                        setTimeout(() => {
                            screenImage.src = 'ATMFinancEdWelcome.gif';
                        }, 5000);
                    }
                }, 500);
            }, 3000);
            return;
        }

        screenImage.src = 'Incorrect_Pin.png';

        setTimeout(() => {
            screenImage.src = 'TakeYourCard.png';
            resetBlinking();

            clearInterval(checkCardRemoval);  // Clear any existing interval before setting a new one
            checkCardRemoval = setInterval(() => {
                if (isCardRemoved) {
                    clearInterval(checkCardRemoval);
                    screenImage.src = 'Thankyou.png';

                    setTimeout(() => {
                        screenImage.src = 'ATMFinancEdWelcome.gif';
                    }, 5000);
                }
            }, 500);
        }, 3000);
    }

    function showRetryButton() {
        const retryCard = document.createElement('div');
        retryCard.id = 'retry-card';
        retryCard.innerHTML = `
            <p>You have entered the incorrect PIN 3 times. Your card is blocked.</p>
            <button id="retry-button">Retry</button>
        `;
        document.body.appendChild(retryCard);

        document.getElementById('retry-button').addEventListener('click', () => {
            location.reload();
        });
    }

    function showTransactionButtons() {
        transactionButtons.style.display = 'grid';
    }

    function hideTransactionButtons() {
        transactionButtons.style.display = 'none';
    }

    function showBalanceInquiryButtons() {
        balanceInquiryButtons.style.display = 'grid';
    }

    function hideBalanceInquiryButtons() {
        balanceInquiryButtons.style.display = 'none';
    }















    




    

    const transactionButtonActions = {
        'mobile-banking': () => {
            screenImage.src = 'Currentlyunavailable.png';

            setTimeout(() => {
                showTryAgainCard();
            }, 2000);

        },
        'pin-change': () => {
            screenImage.src = 'Currentlyunavailable.png';

            setTimeout(() => {
                showTryAgainCard();
            }, 2000);
        },
        'others': () => {
            screenImage.src = 'Currentlyunavailable.png';

            setTimeout(() => {
                showTryAgainCard();
            }, 2000);
        },
        'fast-cash': () => {
            screenImage.src = 'Currentlyunavailable.png';

            setTimeout(() => {
                showTryAgainCard();
            }, 2000);
        },
        'withdrawal': () => {
            screenImage.src = 'Currentlyunavailable.png';

            setTimeout(() => {
                showTryAgainCard();
            }, 2000);
        },
        'balance-inquiry': () => {
            screenImage.src = 'BalanceInquiry_Select_Account_Type.png';
            showBalanceInquiryButtons();
        },
        'mini-statement': () => {
            screenImage.src = 'Currentlyunavailable.png';

            setTimeout(() => {
                showTryAgainCard();
            }, 2000);
        },
    };





    function showTryAgainCard() {
        document.querySelectorAll('.challenge-card, .atm-container, .quiz-card, .quiz2-card, .feedback, .conclusion')
            .forEach(element => element.style.display = 'none');
        document.getElementById('tryAgainCard').style.display = 'flex';
    
        document.getElementById('option111').onclick = () => {
            location.reload();
        };
    
        document.getElementById('option222').onclick = () => {
            window.location.href = 'atmhome.html';
        };
    }














    function showCompletedCard() {
        document.querySelectorAll('.challenge-card, .atm-container, .quiz-card, .quiz2-card, .feedback, .conclusion')
            .forEach(element => element.style.display = 'none');
        document.getElementById('completed').style.display = 'flex';
    
        document.getElementById('option1111').onclick = () => {
            location.reload();
        };
    
        document.getElementById('option2222').onclick = () => {
            window.location.href = 'atmhome.html';
        };
    
        document.getElementById('option3333').onclick = () => {
            window.location.href = '../simpleatmsim.html';
            // Handle option 3333 click action
        };
    }


    












    transactionButtons.addEventListener('click', (event) => {
        const id = event.target.id;
        if (transactionButtonActions[id]) {
            transactionButtonActions[id]();
        }

        hideTransactionButtons();
    });

    document.querySelectorAll('.side-buttons .button').forEach(button => {
        button.addEventListener('click', (event) => {
            const action = event.target.dataset.action;
            if (transactionButtonActions[action]) {
                transactionButtonActions[action]();
                hideTransactionButtons();
            }
        });
    });

    balanceInquiryButtons.addEventListener('click', (event) => {
        const action = event.target.dataset.action;
        if (transactionButtonActions[action]) {
            transactionButtonActions[action]();
            hideBalanceInquiryButtons();
        }
    });

    cardReaders.forEach(reader => {
        reader.addEventListener('click', handleCardReaderClick);
    });

    atmCard.addEventListener('click', handleCardReaderClick);

    function stopBlinkingAnimations() {
        cardReaders.forEach((reader) => {
            setTimeout(() => {
                reader.classList.add('stop-blink');
            }, 3000);
        });
    }

    function resetBlinking() {
        cardReaders.forEach(reader => {
            reader.classList.remove('stop-blink');
        });
    }

    setTimeout(() => {
        atmContainer.style.display = 'none';
        challengecontainer.style.display = 'none';
        quizCard.style.display = 'flex';
    }, 1000);
});
