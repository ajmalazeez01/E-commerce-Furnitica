function add_to_cart(proId){
    console.log("ok");
    $.ajax({ 
        url:'/add_to_cart',
        method:'post',
        data: {
            Id:proId
        },
        success:(response)=>{
            if(response.exist){
                Swal.fire({
                    position: 'center',
                        icon: 'warning',
                        title: 'Product Already in Cart..!',
                        showConfirmButton: false,
                        timer: 1500
                    // title: "Product Already in Wishlist..!",
                    // icon: "warning",
                    // confirmButtonText: false,
                    // timer: 1000
                //   }).then(function () {
                //     location.reload();
                  });
                
                }
                if(response.success){
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'product add successfully',
                        showConfirmButton: false,
                        timer: 1500
                      })
                      let count=response.count
                      $("#cart_count").html(count)

                }
                if(response.outofStock){
                    Swal.fire({
                        position: 'center',
                            icon: 'warning',
                            title: 'Sorry,Product Out of Stock..!',
                            showConfirmButton: false,
                            timer: 1500
                       
                      });
                    
                    }        
        }
    })
}



function addQty(proId,position){
    $.ajax({
        url:'/quantityinc',
        method:'patch',
        data:{
            Id:proId,
            position:position,
            qty:$('#qty_'+position).html()
        },
        success:(response)=>{
            if(response.price){
            let price=response.price
            let qty=$('#qty_'+position).html()
            qty=parseInt(qty)+1
            $('#qty_'+position).html(qty)

            let total=$('#total_'+position).html()
            total=parseInt(total)+price
            $('#total_'+position).html(total)

            let subtotal=$('#subtotal_2').html()
            subtotal=parseInt(subtotal)+price
            $('#subtotal_1').html(subtotal)
            $('#subtotal_2').html(subtotal)
            }
            if(response.outStock){
                Swal.fire({
                    position: 'center',
                        icon: 'warning',
                        title: 'Out of Stock..!',
                        showConfirmButton: false,
                        timer: 1500
                })
            }
            if(response.limit){
                Swal.fire({
                    position: 'center',
                        icon: 'warning',
                        title: 'Limit Exist..!',
                        showConfirmButton: false,
                        timer: 1500
                })
            }
            }
        }
    )

}


function subQty(proId,position){
    $.ajax({
        url:'/productsub',
        method:'patch',
        data:{
            Id:proId,
            position:position,
            qty:$('#qty_'+position).html()
        },
        success:(response)=>{
            if(response.price){
            let price=response.price
            let qty=$('#qty_'+position).html()
            qty=parseInt(qty)-1
            $('#qty_'+position).html(qty)

            let total=$('#total_'+position).html()
            total=parseInt(total)-price
            $('#total_'+position).html(total)

            let subtotal=$('#subtotal_2').html()
            subtotal=parseInt(subtotal)-price
            $('#subtotal_1').html(subtotal)
            $('#subtotal_2').html(subtotal)
            }
            if(response.outStock){
                Swal.fire({
                    position: 'center',
                        icon: 'warning',
                        title: 'Out of Stock..!',
                        showConfirmButton: false,
                        timer: 1500
                })
            }
            if(response.limit){
                Swal.fire({
                    position: 'center',
                        icon: 'warning',
                        title: 'Limit Exist..!',
                        showConfirmButton: false,
                        timer: 1500
                })
            }
            }
        }
    )

}


function addToWishlist(id){
    // console.log(id);
    $.ajax({
        url:'/addTowishlist',
        method:'post',
        data : {
            prodId : id
        },
       
        success:(response)=>{
            if(response.wish){
                Swal.fire({
                    position: 'center',
                        icon: 'warning',
                        title: 'Product Already in Wishlist..!',
                        showConfirmButton: false,
                        timer: 1500
                    // title: "Product Already in Wishlist..!",
                    // icon: "warning",
                    // confirmButtonText: false,
                    // timer: 1000
                //   }).then(function () {
                //     location.reload();
                  });
                
                }
                if(response.success){
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'product add successfully',
                        showConfirmButton: false,
                        timer: 1500
                      })
                      let count=response.count
                      $("#wishlist_count").html(count)

                }
          
        }
    })
    // console.log(data);

}

function setaddress(id){
    $.ajax({
        url:'/setaddress',
        method:'post',
        data : {
            addresId : id
        },
        success:(response)=>{
            console.log(response.data);
            $("#adres_name").val(response.data[0].name);
            $("#adres_line1").val(response.data[0].addressline1);
            $("#adres_line2").val(response.data[0].addressline2);
            $("#adres_district").val(response.data[0].district);
            $("#adres_state").val(response.data[0].state);
            $("#adres_country").val(response.data[0].country);
            $("#adres_pin").val(response.data[0].pin);
            $("#adres_mobile").val(response.data[0].mobile);
            
            }

    })
}


