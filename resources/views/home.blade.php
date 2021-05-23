@extends('layouts.app')

@section('content')

<style>
    #grid_cards {
        display: grid;
        width: 100%;
        max-width: 750px;
        margin: 0 auto;

        grid-template-columns: repeat(auto-fill, 16em);

        grid-gap: 10px;
    }

    .card {
        position: relative;
        padding-bottom: 4em;
    }
    .c-footer{
        position: absolute;
        bottom: 2em;
    }
</style>

<script src="{{ asset('js/index.js') }}"></script>

<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="btn-group mb-4" role="group" aria-label="Basic example">
                <button type="button" onclick="ui.add_sucursal()" class="btn btn-outline-primary">Agregar sucursal</button>
            </div>
            <div id="grid_cards">

            </div>
        </div>
    </div>
</div>
@endsection