function tokenize(input) {
    const tokens = [];
    const tokenSpec = [
      { type: "whitespace", regex: /^\s+/, ignore: true },
      { type: "identifier", regex: /^[a-zA-Z가-힣_][a-zA-Z0-9가-힣_]*/  },
      { type: "number", regex: /^\d+/ },
      { type: "operator", regex: /^[+\-*/=]/ },
      { type: "punctuation", regex: /^[;(){}]/ },
    ];
  
    let remaining = input;
  
    while (remaining.length > 0) {
      let matched = false;
  
      for (const spec of tokenSpec) {
        const match = spec.regex.exec(remaining);
        if (match) {
          matched = true;
          if (!spec.ignore) {

            // 은/는 구분
            if (spec.type === 'identifier'){
              const nextChar = remaining[match[0].length-1];
              if(['은','는'].indexOf(nextChar) !== -1){
                tokens.push({ type:"identifier", value: match[0].slice(0,match[0].length-1) });
                tokens.push({ type: "assign", value: nextChar});
              }else{
                tokens.push({ type: spec.type, value: match[0] });
              }
            }else{
              tokens.push({ type: spec.type, value: match[0] });
            }
            
          }
          remaining = remaining.slice(match[0].length);
          break;
        }
      }
  
      if (!matched) {
        throw new Error(`Unexpected token: ${remaining[0]}`);
      }
    }
  
    return tokens;
  }
  
module.exports = tokenize
  