export const protect = async (req, res, next) => {
  try {
    const { userId } = await req.auth(); // ✅ userId কে destructure করা হচ্ছে

    if (!userId) {
      return res.json({
        success: false,
        message: "Not authenticated",
      });
    }

    // সব ঠিক থাকলে পরের middleware এ যাও
    next();
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
