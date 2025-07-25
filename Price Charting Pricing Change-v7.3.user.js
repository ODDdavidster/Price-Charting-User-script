// ==UserScript==
// @name         Price Charting Pricing Change
// @namespace    http://tampermonkey.net/
// @version      v7.3
// @description  This is a scripted used by a store I work at to show us what our buying and selling prices for games we get will be.
// @author       David Staffen
// @match        https://www.pricecharting.com/*/*/*
// @icon         https://www.pricecharting.com/images/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    function print(text){
        console.log(text);
    }
    function isEven (number) {
        return number % 2 === 0;
    }
    function isFives (number) {
        return number % 5 === 0;
    }
    function strip_waist (element){
        var temp_out_start = document.getElementById(element).outerText; //Get the information from an element
        var fixing_string = temp_out_start.replace('$','') // remove the $
        var temp_out_clean = parseFloat(fixing_string.replace(',','')) // Remove the , and parse the number to be a float so that nothing else remains. (Screw that uppy downer thing)
        return temp_out_clean
    }
    function lessthen_dollar (input){
        if (input < 1) {
            input = "0.50"
            print("input is now: "+input)
        } else{
        print(input+" is 1 or more then 1")
        input = Math.round(input);
        }
        return input
    }
    //EDITABLE VARIABLES these are varibles used to change the store pricing model
    //M = multiplier
    var M_cash_Ut = 0.0 //Cash         Untested  Multiplier
    var M_cash_buy = 0.0 //Cash         Tested    Multiplier
    var M_store_Ut = 0.0 // Store Credit Untested  Multiplier
    var M_store_buy = 0.0 //Store Credit Tested    Multiplier
    var M_store_sell = 0.0 //Store Sell             Multiplier
    const M_Overcharge = 0.0 // The price you set if you want to chare over market value for any item

    //Ut = untested, IS = In Store, T = tested, SP = Store Price

    //Magic Numbers are numbers that people find more apealing.
    var magic_Number_List = [2,5,8,10,12,15,18,20,25,30] //Anything higher then these will become a number devisable by 10 or 5

    function is_magic(numb_in) {
        if (numb_in > 30){
            var temp = numb_in / 5
            temp = Math.round(temp)
            temp = temp*5
            return temp
        } else {
            return magic_Number_List.reduce((closest, current) => {
                return Math.abs(current - numb_in) < Math.abs(closest - numb_in) ? current : closest;
            });
        };
    };

    function edit_document(element = "used_price",avg_price = 1,store_avg = 1,cash_Ut = 1,cash_T = 1,IS_UT=1,IS_T = 1,SP = 1,op=1,overcharge=1.2){
        print("Element is: "+element+"\n")
        document.getElementById(element).setAttribute("style", 'border-width: 3px;')
        document.getElementById(element).innerHTML =
        "<span style='border-width: 5px;'>"
        +"<span style='color: blue; font-size: 20px; border: 3px;'><u>Price Charting:</u></span><br>"
        +"<span style='color: blue; font-size: 20px;'> Avg. Price: $"+avg_price+"</span><br>"
        +"<span style='color: blue; font-size: 20px;'> Store Avg. Price: $"+store_avg+"</span><br><br>"
        +"<span style='color: blue; font-size: 20px;'> Showcase Price: $"+overcharge+"</span><br><br>"
        +"<span style='color: #f5c800; font-size: 20px;'><u>Buy Prices:</u></span><br>"
        +"<span style='color: #f5c800; font-size: 20px;'>Cash Untested: $"+cash_Ut+"</span><br>"
        +"<span style='color: #f5c800; font-size: 20px;'>Cash Tested: $"+cash_T+"</span><br>"
        +"<span style='color: #f53d00; font-size: 20px;'>Credit Untested: $"+IS_UT+"</span><br>"
        +"<span style='color: #f53d00; font-size: 20px;'>Credit tested: $"+IS_T+"</span><br><br>"
        +"<span style='color: green; font-size: 20px;'><u>Sell Prices:</u></span><br>"
        +"<span style='color: green; font-size: 20px;'>Store Price: $"+SP+"</span><br>"
        +"<span style='color: green; font-size: 20px;'>Online Price: $"+op+"</span>"
        +"</span>"
    };
    function price_check(element = "used_price"){
        //Info from price charting
        var avg = strip_waist(element); //Price that Price charting gives us
        var store_avg = is_magic(strip_waist(element)); //Brings the number to the closest magic number, otherwise to the nearest 5 if over the largest magic number

        //Selling Info
        var sell = is_magic(avg*M_store_sell); // our sell price
        var OP = is_magic(avg)-0.01; //store price becuase I'm lazy

        //Overcharged set up
        var over = is_magic(avg*M_Overcharge)-0.01;

        //Maths for the varius Variables.
        var buy_untested_cash = lessthen_dollar(sell*M_cash_Ut); //when buying untested cash games
        var buy_untested = lessthen_dollar(sell*M_store_Ut); // when buying untested store credit
        var buy_tested_cash = lessthen_dollar(sell*M_cash_buy); // when buying tested cash games
        var buy_tested = lessthen_dollar(sell*M_store_buy); // when buying tested credit games
        if (isEven(sell) === true || isFives(sell) === true){
            sell = sell - 0.01
        } else {
            sell += 1
            sell = sell - 0.01
        }
        //(element = "used_price",avg_price = 1,store_avg = 1,cash_Ut = 1,cash_T = 1,IS_UT=1,IS_T = 1,SP = 1,op=1)
        edit_document(element,avg,store_avg,buy_untested_cash,buy_tested_cash,buy_untested,buy_tested,sell,OP,over);
    }
    price_check("used_price");
    price_check("complete_price");
    price_check("new_price");
})();