<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VenueRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && in_array(auth()->user()->role, ['admin', 'staff']);
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'capacity' => 'required|integer|min:1|max:10000',
            'location' => 'required|string|max:255',
            'facilities' => 'nullable|array',
            'facilities.*' => 'string|max:100',
            'base_price' => 'required|numeric|min:0|max:999999.99',
            'additional_features' => 'nullable|array',
            'additional_features.*.name' => 'required_with:additional_features|string|max:100',
            'additional_features.*.price' => 'required_with:additional_features|numeric|min:0|max:999999.99',
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Venue name is required',
            'capacity.required' => 'Venue capacity is required',
            'capacity.min' => 'Venue capacity must be at least 1',
            'capacity.max' => 'Venue capacity cannot exceed 10,000',
            'location.required' => 'Venue location is required',
            'base_price.required' => 'Base price is required',
            'base_price.min' => 'Base price cannot be negative',
        ];
    }
}
