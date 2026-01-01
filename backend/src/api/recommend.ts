import {Router} from 'express';

// Create a router instance
const router = Router();

// Define a POST endpoint for recommendations
router.post('/', (req, res) => {
  
    res.json({
        recommendations: [
            { 
                id: 1,
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                matchScore: 95 },
            { 
                id: 2,
                title: '1984',
                author: 'George Orwell',
                matchScore: 90 },
            ]
    })

})

export default router