// openAI API
let url = `https://open-api.jejucodingcamp.workers.dev/`;

// 사용자의 질문
let question;

// 질문과 답변 저장
let data = [
    {
        role: "system",
        content: "assistant는 엄청난 작가이다. 글은 재미를 제공해야 하고, 30대 남여를 대상으로 해야해",
    },
];

// 화면에 뿌려줄 데이터, 질문들
let questionData = [];

// 사용자의 질문을 객체를 만들어서 push
const sendQuestion = (question) => {
    if (question) {
        data.push({
            role: "user",
            content: question,
        });
        questionData.push({
            role: "user",
            content: question,
        });
    }
};

// 화면에 답변 그려주는 함수
const printAnswer = (answer) => {

    let td = document.querySelector(".bottom-section td");

    // 글을 왼쪽 정렬함. (inner)
    td.style.textAlign = 'left';

    // 문장 단위로 배열에 넣음.
    //let answerArray = answer.replace(/\n\s/g, ' ').split(/(?<=[.!?])"?\s+/);
    let answerArray = answer.split(/(?<=[.!?])\s+|(?<=[.!?])(?=[A-Z])/);

    let checkText = '';
    let currentLength = 0;

    answerArray.forEach((checkArray, index) => {

        // 현재 문장을 추가했을 때의 길이를 계산합니다.
        let totalLength = currentLength + checkArray.length;

        // 누적 길이가 80자를 초과하는 경우 <br> 추가
        if (totalLength > 80) {
            checkText += '<br>';    // 줄바꿈 추가
            currentLength = 0;      // 누적 길이를 리셋
        }

        // 현재 문장 추가
        checkText += (currentLength > 0 ? " " : "") + checkArray;           // 문장 사이에 공백 추가
        // 누적길이 업데이트
        currentLength += checkArray.length + (currentLength > 0 ? 1 : 0);   // 공백을 고려한 길이 추가
    });

    td.innerHTML = checkText; //.replace(/\.\s/g, '.<br>')       // 아래 table에 결과값 출력
};

// api 요청보내는 함수
const apiPost = async () => {
    // submit 버튼 찾기
    const submitButton = document.querySelector("button[type='submit']");

    // 버튼 비활성화
    disableButton(submitButton);

    const result = await fetch(url, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        redirect: "follow",
        })
        .then((res) => res.json())
        .then((res) => {
            printAnswer(res.choices[0].message.content);
            // 글이 출력된 후 submit 버튼을 다시 활성화합니다.
            enableButton(submitButton);     
        })
        .catch((err) => {
            console.log(err);  
            // 오류 발생 시 submit 버튼을 다시 활성화합니다.
            enableButton(submitButton);  
    });
};

// submit
document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();

    // 유효성 검사 체크
    if(isValid()){
        //$input.value = null;
        sendQuestion(question);
        apiPost();
    } else {
        e.preventDefault(); // 유효하지 않을때 폼 제출 방지   
    }
});

function isValid() {
    // 모든 input 요소를 선택합니다.
    let inputs = document.querySelectorAll('.input-form input');
    // 유효하지 않을때 오류메시지 나타내기 위한 변수
    const messageBox = document.getElementById("messageBox");
    // 에러체크위함.
    let isError = true;

    // 체크된 라디오 버튼과 다른 모든 입력 필드의 값을 추출합니다.
    let values = Array.from(inputs)                                 // NodeList를 배열로 변환
        .filter(input => input.type !== 'radio' || input.checked)   // 체크된 라디오 버튼 또는 라디오가 아닌 입력 필드만 필터링
        .map(input => input.value);                                 // 필터링된 입력 필드의 값을 배열로 만듦    
  
    // 한글이 아닌 문자를 찾는 정규 표현식
    let reg = /[^\uAC00-\uD7A3ㅣa-z\x20]/g;           // \x20 공백(' ') 아스키코드, /g 전역검색
 
    for(i=0 ; i < values.length-1 ; i++){

      if(reg.test(values[i])) {
        messageBox.textContent = '한글과 영문만 입력 가능합니다.';    // 오류 메시지를 설정합니다
        messageBox.style.display = "block";                        // 메시지를 보이게 합니다
        
        isError = true;
        break;
      } else {
        isError = false;
      }  
    }

    if(!isError) {
      messageBox.style.display = "none"; // 메시지를 숨깁니다

      question = values[3] + `자 이상 ` + values[1] +` 주제로 ` + values[2] + ` 장르로 ` + values[0] 
                  + `을 써줘. 그리고, 부가적인 설명은 제외해줘`;

      inputs.forEach(input => {
        input.value = ""; // 각 input 요소의 값을 빈 문자열로 설정
      });
      return true;
    } else {
      return false;
    }
};

// 버튼을 비활성화하는 함수
function disableButton(button) {
    button.disabled = true; // 버튼의 disabled 속성 활성화
    button.classList.add('button-disabled'); // 비활성화 스타일 클래스 추가
}
  
// 버튼을 활성화하는 함수
function enableButton(button) {
    button.disabled = false; // 버튼의 disabled 속성 비활성화
    button.classList.remove('button-disabled'); // 비활성화 스타일 클래스 제거
}