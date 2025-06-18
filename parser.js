function parser(tokens) {
  const ast = []
  const current = 0

  // 현재 토큰
  function now(){
    return tokens[current]
  }
  // 다음 토큰
  function next(){
    return tokens[current++]
  }

  // 구문 파싱
  function parseExpression(){
    let left
  }

  // 전체 파싱
  while(current<tokens.length){

    const token = now()

    // 변수 선언
    if(token.type === '키워드' && token.value === '변수'){
      
      next() // 변수
      
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
        value = undefined
      }else{
        next() // 대입연산자
        value = parseExpression()
      }

      ast.push({
        type:'변수선언',
        name:identifier.value,
        value
      })

    }
  }

}