<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Fine extends Model
{
    protected $fillable = [
        'user_id',
        'borrow_id',
        'amount',
        'fine_date',
        'status',
        'payment_method',
        'reason'
    ];

    protected $casts = [
        'fine_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function borrowing(): BelongsTo
    {
        return $this->belongsTo(BorrowingRecord::class, 'borrow_id');
    }
}
