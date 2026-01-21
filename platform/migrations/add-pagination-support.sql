-- Add pagination support helpers
-- These functions help with efficient pagination queries

-- Function to get total count for pagination
CREATE OR REPLACE FUNCTION get_total_count(table_name TEXT, where_clause TEXT DEFAULT '')
RETURNS INTEGER AS $$
DECLARE
  query TEXT;
  result INTEGER;
BEGIN
  query := 'SELECT COUNT(*) FROM ' || table_name;
  IF where_clause != '' THEN
    query := query || ' WHERE ' || where_clause;
  END IF;
  EXECUTE query INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Note: For better performance, consider using materialized views or cached counts
-- This is a basic helper function. In production, you might want to use
-- Supabase's built-in pagination with .range() or implement caching

COMMENT ON FUNCTION get_total_count IS 'Helper function to get total count for pagination. Consider using Supabase range() for better performance.';
