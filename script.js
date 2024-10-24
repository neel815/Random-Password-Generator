const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector(".data-copy");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const symbols = '`~!@#$%^&*₹:;_(}[';

//initially
let password = "";
let passwordLength = 10;
let checkcount = 0;
handleslider();
setIndicator("#ccc");

//this is just for reflect the value of passwordlength into ui
function handleslider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max - min)) + "%100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
}

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomnumber(){
    return getRndInteger(0,9);
}

function generateLowercase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const  randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = uppercaseCheck.checked;
    let hasLower = lowercaseCheck.checked;
    let hasNum = numberCheck.checked;
    let hasSym = symbolCheck.checked;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");  // Green for strong
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");  // Yellow for medium
    } else {
        setIndicator("#f00");  // Red for weak
    }
}


async function copycontent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.add("active");
    },2000);
}

function shufflePassword(array){
    //fisher yates method
    for(let i=array.length-1; i>0; i--)
    {
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handlecheckboxChanges(){
    checkcount = 0;
    allCheckbox.forEach((checkbox) => {
        if(checkbox.checked)
        {
            checkcount++;
        }
    })
}

allCheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change',handlecheckboxChanges);
})

inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleslider();
})

copyBtn.addEventListener('click',() => {
    if(passwordDisplay.value){
        copycontent();
    }
})

generateBtn.addEventListener('click',() => {
    //none of the box is selected
    if(checkcount == 0 ) return;

    if(passwordLength < checkcount){
        passwordLength = checkcount;
        handleslider();
    }

    //let's find new password

    //remove old
    password = "";

    //let's put stuff by filled checkbox
    // if(uppercaseCheck.checked)
    // {
    //     password += generateUppercase();
    // }

    // if(lowercaseCheck.checked)
    // {
    //     password += generateLowercase();
    // }

    // if(numberCheck.checked)
    // {
    //     password += generateRandomnumber();
    // }

    // if(symbolCheck.checked)
    // {
    //     password += generateSymbol();
    // }

    let funArr = [];

    if(uppercaseCheck.checked)
        funArr.push(generateUppercase());
    
    if(lowercaseCheck.checked)
        funArr.push(generateLowercase());

    if(numberCheck.checked)
        funArr.push(generateRandomnumber());

    if(symbolCheck.checked)
        funArr.push(generateSymbol());

    //compulsary addition
    for(let i=0; i<funArr.length; i++){
        password += funArr[i];
    }

    //remaining addition
    for(let j=0; j<passwordLength-funArr.length; j++){
        let randomidx = getRndInteger(0,funArr.length);
        password += funArr[randomidx];
    }

    //shuffle password
    password = shufflePassword(Array.from(password));

    //show in ui
    passwordDisplay.value = password;

    //calculate strength
    calcStrength();
})