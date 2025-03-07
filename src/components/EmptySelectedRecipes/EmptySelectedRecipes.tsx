import { Link } from 'react-router'
import { Button } from '../ui/button/Button'

export const EmptySelectedRecipes = () => {
	return (
		<div className="container mx-auto px-4 py-16 text-center">
			<h1 className="mb-4 text-3xl font-bold">No recipes selected</h1>
			<p className="text-muted-foreground mb-8">
				Go back to the recipes page and select some recipes to see their combined ingredients.
			</p>
			<Link to="/">
				<Button>Browse Recipes</Button>
			</Link>
		</div>
	)
}
