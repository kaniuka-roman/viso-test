import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import { RecipeSelectionProvider } from './context/RecipeSelectionProvider.tsx'
import RecipeListPage from './pages/RecipeListPage.tsx'
import { QueryProvider } from './providers/QueyProvider.tsx'
import SelectedRecipesPage from './pages/SelectedRecipesPage.tsx'
import RecipePage from './pages/RecipePage.tsx'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RecipeSelectionProvider>
			<QueryProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<RecipeListPage />} />
						<Route path="/selected-recipes" element={<SelectedRecipesPage />} />
						<Route path="/recipe/:recipeId" element={<RecipePage />} />
					</Routes>
				</BrowserRouter>
			</QueryProvider>
		</RecipeSelectionProvider>
	</StrictMode>,
)
