$(document).ready(function(){
	$(document).on('click','#submit_login',function(){
          //alert('button-clicked');
          var data={};
          data.user=$('#user-name').val();
          data.pass=$('#user-pass').val();
          $.post('http://localhost:5000/login',data,function(data){
              //console.log(data);

              var output=JSON.parse(data);
          });
          
     });
});