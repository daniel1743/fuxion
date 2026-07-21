-- Step 1: Run this first to get the exact slugs for articles 21-200
-- This will give you the list to paste into Step 2

SELECT id, slug FROM public.wellness_articles ORDER BY created_at ASC LIMIT 200;
