import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Recipe } from '@/types/recipe'

interface RecipeSelectionContextType {
	selectedRecipes: Recipe[]
	addRecipe: (recipe: Recipe) => void
	removeRecipe: (id: string) => void
	clearSelection: () => void
}

const RecipeSelectionContext = createContext<RecipeSelectionContextType | undefined>(undefined)

export function RecipeSelectionProvider({ children }: { children: ReactNode }) {
	const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>(
		JSON.parse(localStorage.getItem('selectedRecipes') || '') || [],
	)

	useEffect(() => {
		localStorage.setItem('selectedRecipes', JSON.stringify(selectedRecipes))
	}, [selectedRecipes])

	const addRecipe = (recipe: Recipe) => {
		setSelectedRecipes((prev) => {
			if (prev.some((r) => r.idMeal === recipe.idMeal)) {
				return prev
			}
			return [...prev, recipe]
		})
	}

	const removeRecipe = (id: string) => {
		setSelectedRecipes((prev) => prev.filter((recipe) => recipe.idMeal !== id))
	}

	const clearSelection = () => {
		setSelectedRecipes([])
	}

	return (
		<RecipeSelectionContext.Provider
			value={{ selectedRecipes, addRecipe, removeRecipe, clearSelection }}
		>
			{children}
		</RecipeSelectionContext.Provider>
	)
}

export const useRecipeSelection = () => {
	const context = useContext(RecipeSelectionContext)
	if (context === undefined) {
		throw new Error('useRecipeSelection must be used within a RecipeSelectionProvider')
	}
	return context
}
