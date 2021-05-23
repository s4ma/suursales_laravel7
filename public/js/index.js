const ui = {
    add_sucursal: async function(){

        swal.mixin({
            input: 'text',
            confirmButtonText: 'Siguiente &rarr;',
            showCancelButton: true,
            progressSteps: ['1', '2', '3', '4'],
            validationMessage: "Campo obligatorio"
          }).queue([
            ui.getInput("nombre", "Escriba el nombre de la sucursal", "text", "Ej: Maria" ),
            ui.getInput("Descripción", "Escriba la descripcion (opcional)","textarea", "Descripción"),
            ui.getInput("Telefono", "Escriba el numero de telefono", "number", "Ej: 305123456"),
            ui.getInput("Dirección", "Escriba la dirección de la sucursal", "text", "Ej: Calle 15 #123 B56")
          ]).then((result) => {
            if (result.value) {
                let data = result.value;

                db.createSucursal({
                    nombre: data[0],
                    desccripcion: data[1],
                    telefono: data[2],
                    direccion: data[3],
                    estado: "1",
                    foto: "sucursal.png"
                });
            }
          })
    },
    getInput: function (title, text, inputType, placeholder) {
        return {
            title: title,
            text: text,
            input: inputType,
            inputAttributes: {
                placeholder: placeholder,
                required: "required"
            }
          }
    },
    showError: function(){
        Swal.fire({
            title: 'Error',
            text: 'Ocurrio un error, intente de nuevo mas tarde', 
            icon: 'error' 
         });
    },
    showGridData: function(data){
        if(Array.isArray(data)){
            window.data = data;
            grid_cards.innerHTML = "";
            data.map((element, i) => {
                grid_cards.innerHTML +=`<div class="card">
                                        <img class="card-img-top" src="/uploads/${element.foto}" alt="Card image cap">
                                        <div class="card-body">
                                            <h5 class="card-title">${element.nombre}</h5>
                                            <p class="card-text">${element.desccripcion}</p>
                                            <p class="card-text"><b>Dirección: </b>${element.direccion}</p>
                                            <div class="c-footer">
                                               <a href="#" onclick="ui.editElement(${i})" class="btn btn-outline-primary btn-sm">Editar</a>
                                               <a href="#" onclick="ui.deleteElement(${i})" class="btn btn-outline-danger btn-sm">Borrar</a>
                                            </div>
                                        </div>
                                        </div>`
            })
        }
    },
    editElement: async function(i){
        const item = window.data[i];
        
        const { value: formValues } = await Swal.fire({
            title: 'Editar datos',
            html: ` <form id="form_editar" enctype="multipart/form-data" >
                        <input name="id" type="hidden" value="${item.id}">
                        <input name="nombre" type="text" value="${item.nombre}" placeholder="Nombre" required="required" id="swal-input-nombre" class="swal2-input">
                        <input name="direccion" type="text" value="${item.direccion}" placeholder="Dirección" required="required" id="swal-input-direccion" class="swal2-input"> 
                        <input name="telefono" type="number" value="${item.telefono}" placeholder="Telefono" required="required" id="swal-input-telefono" class="swal2-input" style="max-width: 100%;">
                        <textarea name="desccripcion" placeholder="Descripción" required="required" class="swal2-textarea" id="swal-input-descripcion" style="display: flex;">${item.desccripcion.trim()}</textarea>
                        <div class="div_img" style="    display: flex;width: 100%; justify-content: center;">
                            <img class="car-img" style="max-width: 70%;" src="/uploads/${item.foto}">
                        </div>
                        <input name="foto" id="swal-input-foto" class="mt-3 mb-3" type="file" accept="image/*">
                    </form>`,
            focusConfirm: false,
            preConfirm: () => {
              return {
                nombre: document.getElementById('swal-input-nombre').value,
                desccripcion: document.getElementById('swal-input-descripcion').value,
                direccion: document.getElementById('swal-input-direccion').value,
                telefono: document.getElementById('swal-input-telefono').value,
                foto: document.getElementById('swal-input-foto').files[0],
              }
            }
          })
          
          if (formValues) {
            db.editSucursal(formValues);
          }

    },
    deleteElement: function(i){
        Swal.fire({
           title: 'Eliminar',
           text: '¿Reamente desea eliminar esta sucursal?', 
           icon: 'info',
           confirmButtonColor: "red",
           confirmButtonText: "Borrar"
        }).then(res=>{
            if(res.value){
                db.borrarSucursal(i)
            }
        });
    }
}

const db = {
    getGridData: function(){
        $.ajax({
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            url: '/get/sucursales',
            method: "get",
            dataType: 'json',
        }).done(resp => {
            if(Array.isArray(resp)){
                ui.showGridData(resp)
            }
        }).catch(e=>{
            console.error(e);
            ui.showError();
        });
    },
    createSucursal: function(data){
        $.ajax({
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            url: '/create/sucursal',
            method: "POST",
            dataType: 'json',
            data: data
        }).done(resp => {
            if(resp.id){
                Swal.fire({
                    toast: true,
                    icon: "success",
                    title: "Operación exitosa",
                    position: "bottom",
                    timer: 3000,
                    showConfirmButton: false,
                    timerProgressBar: true
                })

                db.getGridData()
            }
        }).catch(e=>{
            console.error(e);
            ui.showError();
        });
    },
    editSucursal: function(values){

        $.ajax({
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            url: '/update/sucursal',
            method: "POST",
            dataType: 'json',
            data: new FormData(document.getElementById("form_editar")),
            processData: false,
            contentType: false   
        }).done(resp => {
            if(resp.id){
                db.getGridData();
            }
        }).catch(e=>{
            console.error(e);
            ui.showError();
        });
        
    },
    borrarSucursal: function(i){
        
        const id = window.data[i].id;

        $.ajax({
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            url: "/delete/sucursal/" + id,
            method: "GET",
            dataType: 'json',
        }).done(resp => {
            if(resp.deleted){
                Swal.fire({
                    toast: true,
                    icon: "success",
                    title: "Operación exitosa",
                    position: "bottom",
                    timer: 3000,
                    showConfirmButton: false,
                    timerProgressBar: true
                })

                db.getGridData()
            }
        }).catch(e=>{
            console.error(e);
            ui.showError();
        });
    }
    
}

window.addEventListener('load', function(){
    window.grid_cards = document.getElementById("grid_cards");
    db.getGridData();
})