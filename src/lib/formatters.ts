/**
 * 日付を「YYYY年MM月DD日」形式にフォーマット
 */
export function formatDate(dateString: string): string {
    // 日付文字列に日本時間のタイムゾーン情報を追加
    const date = new Date(dateString + 'T00:00:00+09:00');
    return new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Tokyo'
    }).format(date);
}

/**
 * 金額を「¥XXX,XXX」形式にフォーマット
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY'
    }).format(amount);
} 