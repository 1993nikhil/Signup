$(document).ready(function(){
	var edit_key=0;
	var user_error="";
	var edit;
	$('.client_err').text('');

    $.post('http://localhost:5000',{},function(data){

    	var output=JSON.parse(data);
		        
			            //var imgs="";
			               $.each(output,function(k,v){
			               	var imgs="";
			                    console.log(v);
                               for(var m=0;m<v.files.length;m++){

                               	imgs+="<img src=\""+v.files[m]+"\" height=\"20\" width=\"20\">"
                               }



			           	 $('.table').append('<tr><td>'+v.fname+'</td><td>'+v.lname+'</td><td>'+v.email+'</td><td>'+v.pass+'</td><td>'+v.user+'</td>'+

			           	 	      	 	'<td><img src=\"'+v.file+'\"  height=\"50\" width=\"50\"></td>'+
			           	 	      	 '<td>'+v.file+'</td>'+	


			           	 	      	'<td>'+v.files+'</td>'+
			           	 	      	 '<td>'+imgs+'</td>'



			           	 	      	+'<td>'+v.addr+'</td>'+
                                  '<td><button class=\"btn btn-info edit-button\">Edit<input type=\"hidden\" value=\"'+v._id+'\" class=\"key\"></button></td>'+
                                   '<td><button class=\"btn btn-info delete-button\">Delete<input type=\"hidden\" value=\"'+v._id+'\" class=\"key\"></button></td>'+   
                                    +
                                  '</tr>');


			           });
           
    });



	$(document).on('change','#file',function(e){
		
		var reader=new FileReader;
		reader.readAsDataURL(e.target.files[0]);
		reader.onload=function(e){
			
		      
             $('#my_img').attr('src',e.target.result);
		}


	});
    /*Add Addres */
    $(document).on('click','#add_btn_addr',function(e){
    	$('#form-field').append('<input type=\"text\" class=\" form-control addr additional\" name=\"addr\">');


    });

    $(document).on('click','#delete_btn_addr',function(){
    	$("#form-field").children('.additional').last().remove();
    	
    });





	 $(document).on('change','#file_gallery',function(e){
               
      $('#dvgallery').html('<span></span>');
         var files=[];
  
       for(var i=0;i<e.target.files.length;i++){
           files.push(e.target.files[i]);
       }
          
         for(var k=0;k<files.length;k++){
             
             var reader=new FileReader;
             
             reader.readAsDataURL(files[k]);
             
             reader.onload=function(e){
            
                 $('#dvgallery').append('<img src=\"'+e.target.result+'\" height=\"100\" width=\"200\">');
                  
                
                }
             
             
        }

      
    
  
    });

   $(document).on('keyup','#user',function(){

      var data={};
      data.user=$(this).val();
      $.post('http://localhost:5000/user-validate',data,function(data){
      	$('#user_err').html(data);
      });

   });

   $(document).on('click','.delete-button',function(){
   	var data={};
   	data.id=$(this).find('.key').val();
     

    $.get('http://localhost:5000/delete',data,function(data){
         console.log('delete using get');
    	alert(data);
    	location.reload(true);
    });

   });

   
   $(document).on('click','.edit-button',function(){
   	//alert('edit clicked');
   	var data={};
   	data.id=$(this).find('.key').val();
    
     edit_key=1;
   $.get('http://localhost:5000/edit_show',data,function(data){
   	   var output=JSON.parse(data);
   	    $.each(output,function(k,v){
			                    //console.log(v.addr);
			           	$('#fname').val(v.fname);
			           	$('#lname').val(v.lname);
			           	$('#user').val(v.user);
			           	//$('#user').prop('disabled', true);
			           	$('#pass').val(v.pass);
			           	$('#xemail').val(v.email);
			           	$('#submit').text('Edit');
                        var k=v.addr.length;
                        if(k==1){
                        	$('.addr').val(v.addr);

                        } else {
                        	/*$(v.addr).each(function(){
                        		$('#form-field').append('')
                        	});*/
   	                         $('.addr').val(v.addr[0]);
                           
                          for(var j=1;j<k;j++)
                          	$('#form-field').append('<input type=\"text\" class=\" form-control addr additional\" name=\"addr\" value=\"'+v.addr[j]+'\">');

                        }
                        //$('#dv')

                        for(var j=0;j<v.files.length;j++){
                        	$('#dvgallery').append('<img src=\"'+v.files[j]+'\" height=\"100\" width=\"200\">');
                        }




   			           	$('#my_img').attr('src',v.file);
			           	edit=v._id;
			           });
   	});
    



   });

	
	
	$(document).on('submit','#files',function(e){
		
		e.preventDefault();
		var msg="";
		var addr=[];
		var fname;var lname;var user;var email;var pass;
		fname=$('#fname').val();
		lname=$('#lname').val();
		user=$('#user').val();
		email=$('#xemail').val();
		file=$('#file').val();
		pass=$('#pass').val();
         

        $('.addr').each(function(){
        	addr.push($(this).val());
        });  
        

       for(var i=0;i<addr.length;i++){
       	console.log(addr[i]);
       }


		if($.trim(fname)==""){
			$('#fname_err').text('Please Enter Fname');
			msg+="1";
		}
		if($.trim(lname)==""){
			$('#lname_err').text('Pleas Enter Lname');
			msg+="2";

		}
		if($.trim(user)==""){
			$('#user_err').text('Please Enter Password');
			msg+="3";

		}
		if(($.trim(pass)=="")||(pass.length<8)){
			$('#pass_err').text("Password Invalid");
			msg+="4";
		}
		if(!isEmail(email)){
			$('#email_err').text('Email Invalid');
			msg+="5";
		}
		if($.trim(email)==""){
			$('#emal_err').text('Email Invalid');
			msg+="5";

		}

		if($('#user_err').html().length>0){
			//$('.client_err').text('user already exists');
			msg+="6";
		}

		if(msg.length>0){
			$('.client_err').text('Their is Some Error');

          


		} else {
			$('.client_err').text('All Ok');
			


		   
           
            
        var formData = new FormData($(this)[0]);
        if(edit_key!=1){
        $.ajax({
		        url: 'http://localhost:5000/log',
		        type: 'POST',
		        data: formData,
		        async: false,
		        success: function (data) {
		        	

		        	location.reload(true);
			            
			          
		            
		        },
		        cache: false,
		        contentType: false,
		        processData: false
		    });}
     else {
     	 $.ajax({
		        url: 'http://localhost:5000/edit',
		        type: 'POST',
		        data: formData,
		        async: true,
		        success: function (data) {
		        	
		        	location.reload(true);
		        	
			            
			          
		            
		        },
		        cache: false,
		        contentType: false,
		        processData: false
		    });
     }

     if(edit_key==1){
     	//alert('reloading');
     	location.reload(true);
     }

}

   
  
     

	});
	function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

});