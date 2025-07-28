const supabase = require("../config/supabase");

// Get all FAQ categories and their questions
exports.getFAQs = async (req, res) => {
  try {
    // Fetch metadata
    const { data: metadata, error: metadataError } = await supabase
      .from("faq_metadata")
      .select("heading, subheading, search_placeholder")
      .single();

    if (metadataError) throw metadataError;

    // Fetch categories and their related questions
    const { data: categories, error: fetchError } = await supabase
      .from("faq_categories")
      .select("id, name, description, faq_questions(id, question, answer)");

    if (fetchError) throw fetchError;

    // Check if categories exist
    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: "No FAQ categories found." });
    }

    // Format the response
    const formattedData = categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      questions: category.faq_questions || [], // Ensure questions is always an array
    }));

    res.status(200).json({
      message: "FAQs fetched successfully",
      metadata: {
        heading: metadata.heading,
        subheading: metadata.subheading,
        searchPlaceholder: metadata.search_placeholder,
      },
      data: formattedData,
    });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create or update an FAQ category and its questions
exports.saveFAQ = async (req, res) => {
  const { heading, subheading, searchPlaceholder, categories } = req.body;

  try {
    // Validate required fields
    if (!heading || !subheading || !searchPlaceholder) {
      return res.status(400).json({
        error: "Heading, subheading, and searchPlaceholder are required.",
      });
    }
    const { data: metadata, error: metadataError } = await supabase
      .from("faq_metadata")
      .upsert({
        id: 1, // Assuming a single row for metadata
        heading,
        subheading,
        search_placeholder: searchPlaceholder,
      })
      .single();

    if (metadataError) throw metadataError;
    // Save or update categories and questions
    if (Array.isArray(categories) && categories.length > 0) {
      for (const category of categories) {
        // Update the category
        const { data: updatedCategory, error: updateError } = await supabase
          .from("faq_categories")
          .update({
            name: category.name,
            description: category.description,
          })
          .eq("id", category.id)
          .single();

        // console.log(updateError);

        if (updateError) {
          // If the error code is "PGRST116" (no rows found), create the category
          if (updateError.code === "PGRST116") {
            const { data: createdCategory, error: createError } = await supabase
              .from("faq_categories")
              .insert([
                {
                  name: category.name,
                  description: category.description,
                },
              ])
              .single();

            if (createError) throw createError;

            category.id = createdCategory.id; // Assign the new category ID
          } else {
            throw updateError; // Throw other errors
          }
        }

        // Handle questions for the category
        if (
          Array.isArray(category.questions) &&
          category.questions.length > 0
        ) {
          for (const question of category.questions) {
            if (!question.question || !question.answer) {
              throw new Error(
                "Each question must have a 'question' and 'answer' field."
              );
            }

            const { data, error: updateQuestionError } = await supabase
              .from("faq_questions")
              .update({
                question: question.question,
                answer: question.answer,
              })
              .eq("category_id", category.id);
            console.log(question);
            console.log(data.length, updateQuestionError);

            if (data.length === 0) {
              const { data: createdQuestion, error: createError } =
                await supabase
                  .from("faq_questions")
                  .insert([
                    {
                      question: question.question,
                      answer: question.answer,
                      category_id: category.id,
                    },
                  ])
                  .single();
              if (createError) throw createError;
            }
            // Create a new question
          }
        }
      }
    }

    res.status(200).json({
      message: "FAQ data saved successfully",
    });
  } catch (error) {
    console.error("Error saving FAQ data:", error);
    res.status(400).json({ error: error.message });
  }
};

// Delete an FAQ category and its questions
exports.deleteFAQ = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("faq_categories")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.status(200).json({ message: "FAQ deleted successfully", data });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    res.status(500).json({ error: error.message });
  }
};
