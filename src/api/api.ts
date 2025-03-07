import type { Recipe, Category } from '@/types/recipe'
import ky from 'ky'

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1'
const firstLetters = [
	'a',
	'b',
	'c',
	'd',
	'e',
	'f',
	'g',
	'h',
	'i',
	'j',
	'k',
	'l',
	'm',
	'n',
	'o',
	'p',
	'q',
	'r',
	's',
	't',
	'u',
	'v',
	'w',
	'x',
	'y',
	'z',
]

export const getAllRecipes = async () => {
	const res = await Promise.all(
		firstLetters.map((letter) =>
			ky<{ meals: Recipe[] }>(`${BASE_URL}/search.php?f=${letter}`).json(),
		),
	)
	return res
		.filter(({ meals }) => meals)
		.map(({ meals }) => meals)
		.flat(1)
}
export const getSearchRecipes = async (searchTerm: string) => {
	const url = `${BASE_URL}/search.php?s=${encodeURIComponent(searchTerm)}`

	const res = await ky<{ meals: Recipe[] }>(url).json()
	return res.meals
}

export const fetchRecipeById = async (id: string | undefined): Promise<{ meals: Recipe[] }> => {
	const url = `${BASE_URL}/lookup.php?i=${id}`
	const response = await ky<{ meals: Recipe[] }>(url).json()
	return response
}

// Fetch all categories
export const fetchCategories = async (): Promise<{ categories: Category[] }> => {
	const url = `${BASE_URL}/categories.php`
	const response = await ky<{ categories: Category[] }>(url).json()
	return response
}
