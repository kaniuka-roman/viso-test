'use client'

import { useState, useRef } from 'react'
import { ArrowLeft, ListChecks, Trash2 } from 'lucide-react'
import { useRecipeSelection } from '@/context/RecipeSelectionProvider'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button/Button'
import { CombinedIngredientsList } from '@/components/CombinedIndgedientsList/CombinedIndgedientsList'
import { EmptySelectedRecipes } from '@/components/EmptySelectedRecipes/EmptySelectedRecipes'
import { SelectedRecipeCard } from '@/components/SelectedRecipeCard/SelectedRecipeCard'

export default function SelectedRecipesPage() {
	const { selectedRecipes, removeRecipe, clearSelection } = useRecipeSelection()
	const [isIngredientsListExpanded, setIsIngredientsListExpanded] = useState(false)
	const ingredientsListRef = useRef<HTMLDivElement>(null)

	const scrollToIngredientsList = () => {
		if (ingredientsListRef.current) {
			ingredientsListRef.current.scrollIntoView({ behavior: 'smooth' })
			if (!isIngredientsListExpanded) {
				setIsIngredientsListExpanded(true)
			}
		}
	}

	if (selectedRecipes.length === 0) {
		return <EmptySelectedRecipes />
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-6">
				<Link to="/" className="text-primary inline-flex items-center hover:underline">
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to recipes
				</Link>
			</div>

			<div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
				<h1 className="text-3xl font-bold">Selected Recipes ({selectedRecipes.length})</h1>
				<div className="flex gap-2">
					<Button variant="outline" onClick={scrollToIngredientsList} className="self-start">
						<ListChecks className="mr-2 h-4 w-4" />
						View Combined Ingredients
					</Button>
					<Button variant="destructive" onClick={clearSelection} className="self-start">
						<Trash2 className="mr-2 h-4 w-4" />
						Clear All
					</Button>
				</div>
			</div>

			{/* Recipe Cards */}
			<div className="mb-12 space-y-6">
				{selectedRecipes.map((recipe) => (
					<SelectedRecipeCard key={recipe.idMeal} recipe={recipe} onRemove={removeRecipe} />
				))}
			</div>
			<div ref={ingredientsListRef}>
				<CombinedIngredientsList
					recipes={selectedRecipes}
					initialExpanded={isIngredientsListExpanded}
					onToggleExpand={setIsIngredientsListExpanded}
				/>
			</div>
		</div>
	)
}
