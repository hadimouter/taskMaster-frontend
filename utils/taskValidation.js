
const normalizeText = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ');
  };
  
  export const checkDuplicateTask = (newTitle, existingTasks) => {
    const normalizedNewTitle = normalizeText(newTitle);
    
    const similarTasks = existingTasks.filter(task => {
      const normalizedExistingTitle = normalizeText(task.title);
      return normalizedExistingTitle === normalizedNewTitle;
    });
  
    return {
      hasDuplicate: similarTasks.length > 0,
      duplicateTasks: similarTasks
    };
  };