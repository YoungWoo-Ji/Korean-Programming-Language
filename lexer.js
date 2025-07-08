function tokenizer(input) {
  const tokens = []
  const lines = input.split('\n')
  for(let i=0;i<lines.length;i++){
    const newTokens = classifyToken(lines[i],i+1)
    tokens.push(...newTokens)
  }
  return tokens
}

function classifyToken(input,line){
  const tokens = []
  const words = input.trim().split(' ')
  let isStringStarted = false
  let quoteType
  let stringValue = ""

  for (let word of words){
    // 빈 문자열
    if(word === ''){
      if(isStringStarted){
        stringValue+=' '
      }

    // 문자열 시작
    }else if(!isStringStarted && (word.startsWith("'") || word.startsWith('"'))){
      isStringStarted = true
      stringValue += word.substr(1)
      quoteType = word.substr(0,1)

      if(word.substr(1).includes(quoteType)){
        if(word.endsWith(quoteType)){
          stringValue = stringValue.slice(0,-1)
          isStringStarted = false
          tokens.push({type:'문자열', value:stringValue, line})
        }else{
          throw new Error(`잘못된 문자열 형식입니다 (줄 ${line})`) 
        }
      }
    
    }else if(isStringStarted){

      if(word.includes(quoteType)){
        if(word.endsWith(quoteType)){
          stringValue += ' '+word.slice(0,-1)
          isStringStarted = false
          tokens.push({type:'문자열', value:stringValue, line})
        }else{
          throw new Error(`잘못된 문자열 형식입니다 (줄 ${line})`) 
        }
      } else {
        stringValue += ' '+word
      }
      
    // 키워드
    }else if(['변수','출력','입력','만약','이면','끝'].includes(word)){
      tokens.push({type:'키워드',value:word, line})

    // 자료형변환
    }else if(['숫자','문자','논리값'].includes(word)){
      tokens.push({type:'자료형',value:word, line})

    // 대입 연산자
    }else if(['은','는'].includes(word)){
      tokens.push({type:'대입연산자',value:word, line})

    // 산술 연산자
    }else if(['+','-','*','/','>','<','>=','<=','==','!=','===','!=='].includes(word)){
      tokens.push({type:'이항연산자',value:word, line})

    // 숫자
    }else if(!isNaN(word)){
      tokens.push({type:'숫자',value:Number(word), line})

    // 불리언
    }else if(['참','거짓'].includes(word)){
      tokens.push({type:'논리값',value:word==='참', line})

    // 식별자
    }else{
      if(!isNaN(word.substr(0,1))){
        throw new Error(`식별자 혹은 키워드는 숫자로 시작할 수 없습니다. (줄 ${line})`)
      }

      if(!(/^[\w가-힣]+$/.test(word))){
        throw new Error(`식별자 혹은 키워드에 '_'를 제외한 특수문자를 입력할 수 없습니다. (줄 ${line})`)
      }

      tokens.push({type:'식별자',value:word, line})

    }
  }

  if(isStringStarted){
    throw new Error(`잘못된 문자열 형식입니다 (줄 ${line})`) 
  }

  return tokens
}
  
module.exports = tokenizer
  