const formatService={
    //${dd}-${mm}-${yyyy}
    formatDateV1:(dateTemp)=>{
        if (!dateTemp) {
            return "";
          }
          let dd = dateTemp.getDate();
          let mm = dateTemp.getMonth() + 1;
          const yyyy = dateTemp.getFullYear();
        
          return `${dd}-${mm}-${yyyy}`;
    },
    formatVndMoney:(money)=>{
        try {
          if (typeof money === "string") {
            return parseInt(money).toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            });
          }
        
          return money.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          });
        } catch {
          return "";
        }
    },
}
module.exports = formatService;