<?php

namespace App\Http\Controllers;

use App\Sucursal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SucursalController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = Sucursal::orderBy('id', 'DESC')->get();
        
        return response()->json($data);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        $data = request()->all();
        

        $new = new Sucursal;
        $new->nombre = $data["nombre"];
        $new->desccripcion = $data["desccripcion"];
        $new->telefono = intval($data["telefono"]);
        $new->direccion = $data["direccion"];
        $new->estado = "1";
        $new->foto = $data["foto"];
        $new->save();

        return response()->json($new);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Sucursal  $sucursal
     * @return \Illuminate\Http\Response
     */
    public function show(Sucursal $sucursal)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Sucursal  $sucursal
     * @return \Illuminate\Http\Response
     */
    public function edit(Sucursal $sucursal)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Sucursal  $sucursal
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $sucursal = Sucursal::find($request->id);

        if($request->hasFile('foto')){
            $file = $request->file('foto');
            $nombrearchivo  = time() . "." . $file->getClientOriginalExtension();
            $file->move(public_path("uploads/"),$nombrearchivo);
            
            $sucursal->nombre = $request->nombre;
            $sucursal->desccripcion = $request->desccripcion;
            $sucursal->telefono = $request->telefono;
            $sucursal->direccion = $request->direccion;
            $sucursal->foto = $nombrearchivo;

            $sucursal->save();

            return response()->json($sucursal);
        }else{
            $sucursal->nombre = $request->nombre;
            $sucursal->desccripcion = $request->desccripcion;
            $sucursal->telefono = $request->telefono;
            $sucursal->direccion = $request->direccion;
            $sucursal->save();
        }
        return response()->json($sucursal);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Sucursal  $sucursal
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
     
        $sucursal = Sucursal::find($id);
        $sucursal->delete();

        return response()->json(["deleted" => true]);
    }
}
