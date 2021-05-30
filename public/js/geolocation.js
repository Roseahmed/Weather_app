if('geolocation'in navigator){
    console.log('Geolocation available');
    navigator.geolocation.getCurrentPosition(position=>{
        console.log(position);
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        console.log(lat,long);
        location=`/weather/${lat}/${long}`;
    },function(error){
        console.log(error);
        if(error.code===1){
            location ='/forecast';
        }
    })
}else{
    alert("Kindly Update your Browser");

}