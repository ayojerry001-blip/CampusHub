<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGroupsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // $method = $this->method();
        // if($method == "PUT"){
        //     return [
        //         'name' => ['required','string','max:255'],
        //         'description' => ['required','string'],
        //         'edited_by' => ['required','integer'],
        //     ];
        // }else{
        //     return [
        //         'name' => ['sometimes','required','string','max:255'],
        //         'description' => ['sometimes','required','string'],
        //         'edited_by' => ['sometimes','required','integer'],
        //     ];
        // }
        return [];
    }
}
