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
  const words = input.trim().split(/\s+/)

  for (let word of words){
    // 빈 문자열
    if(word === ''){
      continue
    
    // 키워드
    }else if(['변수'].includes(word)){
      tokens.push({type:'키워드',value:word, line})

    // 대입 연산자
    }else if(['은','는'].includes(word)){
      tokens.push({type:'대입연산자',value:word, line})

    // 산술 연산자
    }else if(['+','-','*','/'].includes(word)){
      tokens.push({type:'산술연산자',value:word, line})

    // 숫자
    }else if(!isNaN(word)){
      tokens.push({type:'숫자',value:Number(word), line})

    // 식별자
    }else{
      if(!isNaN(word.substr(0,1))){
        throw new Error(`식별자 혹은 키워드는 숫자로 시작할 수 없습니다. (줄 ${line})`)
      }

      if(!(/^[\w가-힣]+$/.test(word))){
        throw new Error(`식별자 혹은 키워드에 \'_\'를 제외한 특수문자를 입력할 수 없습니다. (줄 ${line})`)
      }

      tokens.push({type:'식별자',value:word, line})

    }
  }
  return tokens
}
  
module.exports = tokenizer
  