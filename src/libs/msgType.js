module.exports = {
  setMsg(msg) {

    let type = ''
    let typeReadable = ''
    let color = ''

    switch (msg) {
      case "/cosmos.bank.v1beta1.MsgSend": 
        typeReadable = 'Send' 
        color = '#00b786'
        break;
        
      default:
        console.log("Sorry, dont know " + msg + ".");
    }
    return { type, typeReadable, color }
  }
}
