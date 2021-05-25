module.exports = {
    
    preference: function preference(formObj) {  

    const preference_choice = {};
    let obj = [];
    formObj.multiselect.forEach(element => {
    switch (element) {
        case  "Sunday":
            if(typeof formObj.s_morning !== "undefined"){
                obj["Morning"] = formObj.s_morning;
            }else{
                obj["Morning"] = "N";
            }
            if(typeof formObj.s_afternoon !== "undefined"){
                obj["Afternoon"] = formObj.s_afternoon;
            }else{
                obj["Afternoon"] = "N";
            }
            if(typeof formObj.s_evening !== "undefined"){
                obj["Evening"] = formObj.s_evening;
            }else{
                obj["Evening"] = "N";
            }
            if(typeof formObj.s_night !== "undefined"){
                obj["Night"] = formObj.s_night;
            }else{
                obj["Night"] = "N";
            }
           
            preference_choice["Sunday"] = obj;
            obj = [];
        break;
        case "Monday":
            if(typeof formObj.m_morning !== "undefined"){
                obj["Morning"] = formObj.m_morning;
            }else{
                obj["Morning"] = "N";
            }
            if(typeof formObj.m_afternoon !== "undefined"){
                obj["Afternoon"] = formObj.m_afternoon;
            }else{
                obj["Afternoon"] = "N";
            }
            if(typeof formObj.m_evening !== "undefined"){
                obj["Evening"] =formObj.m_evening;
            }else{
                obj["Evening"] = "N";
            }
            if(typeof formObj.m_night !== "undefined"){
                obj["Night"] = formObj.m_night;
            }else{
                obj["Night"] = "N";
            }
           
            preference_choice["Monday"] = obj;
            obj = [];

        break;
        case "Tuesday":
            if(typeof formObj.t_morning !== "undefined"){
                obj["Morning"] =formObj.t_morning;
            }else{
                obj["Morning"] = "N";
            }
            if(typeof formObj.t_afternoon !== "undefined"){
                obj["Afternoon"] = formObj.t_afternoon;
            }else{
                obj["Afternoon"] = "N";
            }
            if(typeof formObj.t_evening !== "undefined"){
                obj["Evening"] = formObj.t_evening;
            }else{
                obj["Evening"] = "N";
            }
            if(typeof formObj.t_night !== "undefined"){
                obj["Night"] = formObj.t_night;
            }else{
                obj["Night"] = "N";
            }
           
            preference_choice["Tuesday"] = obj;
            obj = [];
        break;
        case "Wednesday":
            if(typeof formObj.w_morning !== "undefined"){
                obj["Morning"] = formObj.w_morning;
            }else{
                obj["Morning"] = "N";
            }
            if(typeof formObj.w_afternoon !== "undefined"){
                obj["Afternoon"] = formObj.w_afternoon;
            }else{
                obj["Afternoon"] = "N";
            }
            if(typeof formObj.w_evening !== "undefined"){
                obj["Evening"] = formObj.w_evening;
            }else{
                obj["Evening"] = "N";
            }
            if(typeof formObj.w_night !== "undefined"){
                obj["Night"] = formObj.w_night;
            }else{
                obj["Night"] = "N";
            }
           
            preference_choice["Wednesday"] = obj;
            obj = [];
        break;
        case "Thursday":
            if(typeof formObj.tr_morning !== "undefined"){
                obj["Morning"] = formObj.tr_morning;
            }else{
                obj["Morning"] = "N";
            }
            if(typeof formObj.tr_afternoon !== "undefined"){
                obj["Afternoon"] = formObj.tr_afternoon;
            }else{
                obj["Afternoon"] = "N";
            }
            if(typeof formObj.tr_evening !== "undefined"){
                obj["Evening"] = formObj.tr_evening;
            }else{
                obj["Evening"] = "N";
            }
            if(typeof formObj.tr_night !== "undefined"){
                obj["Night"] = formObj.tr_night;
            }else{
                obj["Night"] = "N";
            }
           
            preference_choice["Thursday"] = obj;
            obj = [];

        break;
        case "Friday":
            if(typeof formObj.f_morning !== "undefined"){
                obj["Morning"] = formObj.f_morning;
            }else{
                obj["Morning"] = "N";
            }
            if(typeof formObj.f_afternoon !== "undefined"){
                obj["Afternoon"] = formObj.f_afternoon;
            }else{
                obj["Afternoon"] = "N";
            }
            if(typeof formObj.f_evening !== "undefined"){
                obj["Evening"] = formObj.f_evening;
            }else{
                obj["Evening"] = "N";
            }
            if(typeof formObj.f_night !== "undefined"){
                obj["Night"] = formObj.f_night;
            }else{
                obj["Night"] = "N";
            }
           
            preference_choice["Friday"] = obj;
            obj = [];
        break;
        case "Saturday":
            if(typeof formObj.st_morning !== "undefined"){
                obj["Morning"] = formObj.st_morning;
            }else{
                obj["Morning"] = "N";
            }
            if(typeof formObj.st_afternoon !== "undefined"){
                obj["Afternoon"] = formObj.st_afternoon;
            }else{
                obj["Afternoon"] = "N";
            }
            if(typeof formObj.st_evening !== "undefined"){
                obj["Evening"] = formObj.st_evening;
            }else{
                obj["Evening"] = "N";
            }
            if(typeof formObj.st_night !== "undefined"){
                obj["Night"] = formObj.st_night;
            }else{
                obj["Night"] = "N";
            }
           
            preference_choice["Saturday"] = obj;
            obj = [];
        break;
    }

    
});
return preference_choice;
    },

    preferenceList : function preferenceList(formObj) {  

        const preference_choice = {};
        let obj = [];
        formObj.forEach(element => {
        switch (element.DAYSOFWEEK) {
            case  "Sunday":
                
                obj["Morning"] = element.MORNING;
                obj["Afternoon"] = element.AFTERNOON;
                obj["Evening"] = element.EVENING;
                obj["Night"] = element.NIGHT;
                preference_choice["Sunday"] = obj;
                obj = [];
            break;
            case "Monday":
                obj["Morning"] = element.MORNING;
                obj["Afternoon"] = element.AFTERNOON;
                obj["Evening"] = element.EVENING;
                obj["Night"] = element.NIGHT;
               
                preference_choice["Monday"] = obj;
                obj = [];
    
            break;
            case "Tuesday":
                obj["Morning"] = element.MORNING;
                obj["Afternoon"] = element.AFTERNOON;
                obj["Evening"] = element.EVENING;
                obj["Night"] = element.NIGHT;
               
                preference_choice["Tuesday"] = obj;
                obj = [];
            break;
            case "Wednesday":
                obj["Morning"] = element.MORNING;
                obj["Afternoon"] = element.AFTERNOON;
                obj["Evening"] = element.EVENING;
                obj["Night"] = element.NIGHT;
                
               
                preference_choice["Wednesday"] = obj;
                obj = [];
            break;
            case "Thursday":
                obj["Morning"] = element.MORNING;
                obj["Afternoon"] = element.AFTERNOON;
                obj["Evening"] = element.EVENING;
                obj["Night"] = element.NIGHT;
                preference_choice["Thursday"] = obj;
                obj = [];
    
            break;
            case "Friday":
                obj["Morning"] = element.MORNING;
                obj["Afternoon"] = element.AFTERNOON;
                obj["Evening"] = element.EVENING;
                obj["Night"] = element.NIGHT;
               
                preference_choice["Friday"] = obj;
                obj = [];
            break;
            case "Saturday":
                obj["Morning"] = element.MORNING;
                obj["Afternoon"] = element.AFTERNOON;
                obj["Evening"] = element.EVENING;
                obj["Night"] = element.NIGHT;
               
                preference_choice["Saturday"] = obj;
                obj = [];
            break;
        }
    
        
    });
    
    return preference_choice;
        }

}
 