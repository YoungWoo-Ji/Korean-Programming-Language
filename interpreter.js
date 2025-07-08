function interpreter(ast,input) {

  let inputs = input.split('\n')
  const outputs = []
  const env = {} // 변수 저장소

  function evalNode(node) {

    switch (node.type) {
      case '변수선언':
        env[node.name] = evalNode(node.value)
        return

      case '변수대입':
        if (!(node.name in env)) {
          throw new Error(`변수 '${node.name}'는 선언되지 않았습니다. (줄 ${node.line})`)
        }
        env[node.name] = evalNode(node.value)
        return

      case '숫자변환':
        const value = evalNode(node.value)
        return Number(value)

      case '사칙연산':
        const left = evalNode(node.left)
        const right = evalNode(node.right)
        switch (node.operator) {
          case '+': return left + right
          case '-': return left - right
          case '*': return left * right
          case '/': return left / right
        }
        break
      
      case '출력':
        const result = evalNode(node.value)
        console.log(result)
        outputs.push(result)
        return

      case '입력':
        if (!(node.name in env)) {
          throw new Error(`변수 '${node.name}'는 선언되지 않았습니다. (줄 ${node.line})`)
        }
        if(inputs.length === 0){
          throw new Error(`입력된 값이 없습니다. (줄 ${node.line})`)
        }
        let input = inputs[0]

        switch (node.valueType) {
          case '숫자':
            input = Number(input)
            break
          case '논리값':
            input = Boolean(input)
            break
          case '문자':
            input = String(input)
            break
          
        }
        env[node.name] = input
        inputs = inputs.slice(1)
        return

      case '숫자':
        return node.value

      case '문자열':
        return node.value

      case 'undefined':
        return node.value

      case '식별자':
        if (!(node.value in env)) {
          throw new Error(`변수 '${node.value}'는 선언되지 않았습니다. (줄 ${node.line})`)
        }
        return env[node.value]

      default:
        throw new Error(`알 수 없는 AST 노트입니다: ${node.type} (줄 ${node.line})`)
    }
  }

  for (const node of ast) {
    evalNode(node)
  }

  return {env,outputs}
}

module.exports = interpreter