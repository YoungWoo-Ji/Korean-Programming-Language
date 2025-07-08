const priority = {
  '+':1, '-':1,
  '*':2, '/':2
}

function parser(tokens) {
  const ast = []
  let current = 0

  // 현재 토큰
  function now(){
    return tokens[current]
  }
  // 다음 토큰
  function next(){
    return tokens[current++]
  }

  // 숫자 파싱
  function parsePrimary(){
    const token = next()

    if(['문자열','식별자','숫자','논리값'].includes(token.type)) {
      return { type: token.type, value: token.value, line: token.line }
    }

    throw new Error(`잘못된 토큰이 입력되었습니다: ${token.type} (줄 ${token.line})`)
  }

  // 구문 파싱
  function parseExpression(precedene = 0){
    let left = parsePrimary()

    while (true) {
      const token = now()
      if (!token || token.type !== '이항연산자') break

      const tokenPriority = priority[token.value]
      if (tokenPriority < precedene) break

      const operator = next()
      const right = parseExpression(tokenPriority + 1)

      left = {
        type: '이항연산',
        operator: operator.value, 
        left, right,
        line: operator.line
      }
    }

    return left
  }

  // 전체 파싱
  while(current<tokens.length){ 

    const token = now()

    // 변수 선언
    if(token.type === '키워드' && token.value === '변수'){
      
      next() // 키워드 "변수"
      
      // 키워드 뒤에 식별자 확인
      const identifier = now()
      if(identifier.type !== '식별자'){
        throw new Error(`'변수' 키워드 뒤에 식별자가 오지 않았습니다. (줄 ${identifier.line})`)
      }

      next() // 식별자

      // 대입 연산자 확인
      const assignment = now()
      let value
      if(assignment.type !== '대입연산자'){
        value = {type:'undefined',value:undefined,line:identifier.line}
      }else{
        next() // 대입연산자
        value = parseExpression()
      }

      ast.push({
        type:'변수선언',
        name:identifier.value,
        value,
        line:identifier.line
      })

    }
    
    // 조건문
    else if(token.type === '키워드' && token.value === '만약'){
      const keyWord = next()
      const test = parseExpression()
      const thenToken = next()
      if(thenToken.type !== '키워드' || thenToken.value !== '이면'){
        throw new Error(`'만약' 키워드 뒤에 '이면' 키워드가 필요합니다 (줄 ${keyWord.line})`)
      }
      
      let consequent = []
      
      while(now()&&!(now().type === '키워드'&&now().value==='끝')){
        consequent.push(next())
      }
      if(!now()||now().value!=='끝'){
        throw new Error(`조건문이 '끝' 키워드로 닫히지 않았습니다 (줄 ${thenToken.line})`)
      }
      next() // 키워드 '끝'

      consequent = parser(consequent)
      
      ast.push({
        type:'조건문',
        test,
        consequent
      })

    }

    // 출력
    else if(token.type === '키워드' && token.value === '출력'){

      const keyWord = next() // 키워드 "출력"
      const value = parseExpression()

      ast.push({
        type: '출력',
        value,
        line: keyWord.line
      })
    }

    // 입력
    else if(token.type === '키워드' && token.value === '입력'){

      const keyWord = next() // 키워드 "입력"
      const type = next()
      const identifier = next()

      if(identifier.type !== '식별자' || type.type !== '자료형'){
        throw new Error(`키워드 '입력' 뒤에는 자료형과 변수가 나와야 합니다 (줄 ${keyWord.line})`)
      }

      ast.push({
        type: '입력',
        valueType: type.value,
        name: identifier.value,
        line: keyWord.line
      })

    }

    // 변수 대입
    else if(token.type === '식별자'){
      const identifier = next()
      const assign = next()
      
      if(assign.type !== '대입연산자'){
        throw new Error(`식별자 뒤에 '은/는' 이 나오지 않았습니다. (줄 ${assign.line})`)
      }

      const value = parseExpression()

      ast.push({
        type: '변수대입',
        name: identifier.value,
        value,
        line: identifier.line
      })
    }
  }

  return ast
}

module.exports = parser