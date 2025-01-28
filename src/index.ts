/**
 * 간단한 인사말을 반환하는 함수
 * @param name 인사할 대상의 이름
 * @returns 인사말 문자열
 * 
 * @example
 * ```ts
 * hello("홍길동") // "Hello, 홍길동!"
 * ```
 */
const hello = (name: string): string => {
  return `Hello, ${name}!`;
};

/**
 * 좋은 하루인지 확인하는 함수
 * @param score 하루 점수 (0-100)
 * @returns 80점 이상이면 true, 아니면 false
 * 
 * @example
 * ```ts
 * good(85) // true
 * good(70) // false
 * ```
 */
const good = (score: number): boolean => {
  return score >= 80;
};

// 모든 함수를 하단에서 한번에 export
export { hello, good };
