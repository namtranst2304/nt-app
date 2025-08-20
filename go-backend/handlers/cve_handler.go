package handlers

import (
	"time"

	"go-backend/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// Get CVE mock data
func GetCVEMockData(c *fiber.Ctx) error {
	// Mock CVE data based on the provided JSON
	mockCVE := models.CVE{
		ID:          uuid.MustParse("01985ed2-ef4e-7fdf-bf01-e2cd38eae95f"),
		VulnID:      "CVE-2013-4868",
		Source:      "nvd",
		Aliases:     "",
		Published:   time.Date(2019, 12, 27, 17, 15, 15, 657000000, time.UTC),
		Description: "Karotz API 12.07.19.00: Session Token Information Disclosure",
		CWEs: []models.CWE{
			{
				Title:    "CWE - 200: Exposure of Sensitive Information to an Unauthorized Actor",
				InfoLink: "https://cwe.mitre.org/data/definitions/200.html",
			},
		},
		References:         "* [http://www.exploit-db.com/exploits/27285](http://www.exploit-db.com/exploits/27285)\n* [http://www.securityfocus.com/bid/61584](http://www.securityfocus.com/bid/61584)\n* [https://exchange.xforce.ibmcloud.com/vulnerabilities/86221](https://exchange.xforce.ibmcloud.com/vulnerabilities/86221)\n* [http://www.exploit-db.com/exploits/27285](http://www.exploit-db.com/exploits/27285)\n* [http://www.securityfocus.com/bid/61584](http://www.securityfocus.com/bid/61584)\n* [https://exchange.xforce.ibmcloud.com/vulnerabilities/86221](https://exchange.xforce.ibmcloud.com/vulnerabilities/86221)",
		Severity:           "medium",
		Analysis:           "",
		Suppressed:         "",
		CvssV3ImpactScore:  1.4123999999999999,
		CvssV3BaseScore:    5.3,
		CvssV3ExploitScore: 3.8870427750000003,
		EpssScore:          0.125,
		EpssPercentile:     9.9,
		CreatedAt:          time.Date(2025, 7, 31, 11, 52, 18, 891662000, time.UTC),
		UpdatedAt:          time.Date(2025, 8, 18, 12, 29, 4, 219148000, time.UTC),
		DeletedAt:          nil,
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    mockCVE,
		"message": "CVE data retrieved successfully",
	})
}

// Get all CVE vulnerabilities (mock list)
func GetAllCVEs(c *fiber.Ctx) error {
	// Mock multiple CVE entries for testing
	mockCVEs := []models.CVE{
		{
			ID:              uuid.New(),
			VulnID:          "CVE-2013-4868",
			Source:          "nvd",
			Description:     "Karotz API 12.07.19.00: Session Token Information Disclosure",
			Severity:        "medium",
			CvssV3BaseScore: 5.3,
			Published:       time.Date(2019, 12, 27, 17, 15, 15, 0, time.UTC),
			CreatedAt:       time.Now(),
			UpdatedAt:       time.Now(),
		},
		{
			ID:              uuid.New(),
			VulnID:          "CVE-2024-1234",
			Source:          "nvd",
			Description:     "Example vulnerability for testing purposes",
			Severity:        "high",
			CvssV3BaseScore: 8.5,
			Published:       time.Date(2024, 6, 15, 10, 30, 0, 0, time.UTC),
			CreatedAt:       time.Now(),
			UpdatedAt:       time.Now(),
		},
		{
			ID:              uuid.New(),
			VulnID:          "CVE-2024-5678",
			Source:          "nvd",
			Description:     "Another example vulnerability with critical severity",
			Severity:        "critical",
			CvssV3BaseScore: 9.8,
			Published:       time.Date(2024, 8, 1, 14, 20, 0, 0, time.UTC),
			CreatedAt:       time.Now(),
			UpdatedAt:       time.Now(),
		},
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    mockCVEs,
		"count":   len(mockCVEs),
		"message": "CVE list retrieved successfully",
	})
}

// Get CVE by ID
func GetCVEByID(c *fiber.Ctx) error {
	id := c.Params("id")

	// For demo purposes, return the mock CVE if ID matches
	if id == "01985ed2-ef4e-7fdf-bf01-e2cd38eae95f" {
		return GetCVEMockData(c)
	}

	// Return not found for other IDs
	return c.Status(404).JSON(fiber.Map{
		"success": false,
		"message": "CVE not found",
		"data":    nil,
	})
}

// Create new CVE (for testing purposes)
func CreateCVE(c *fiber.Ctx) error {
	var cve models.CVE

	if err := c.BodyParser(&cve); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
			"error":   err.Error(),
		})
	}

	// Set timestamps
	cve.CreatedAt = time.Now()
	cve.UpdatedAt = time.Now()
	cve.ID = uuid.New()

	return c.Status(201).JSON(fiber.Map{
		"success": true,
		"data":    cve,
		"message": "CVE created successfully",
	})
}

// Update CVE by ID
func UpdateCVE(c *fiber.Ctx) error {
	id := c.Params("id")

	var updateData map[string]interface{}
	if err := c.BodyParser(&updateData); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
			"error":   err.Error(),
		})
	}

	// For demo purposes, return success message
	return c.JSON(fiber.Map{
		"success": true,
		"message": "CVE updated successfully",
		"id":      id,
		"data":    updateData,
	})
}

// Delete CVE by ID
func DeleteCVE(c *fiber.Ctx) error {
	id := c.Params("id")

	return c.JSON(fiber.Map{
		"success": true,
		"message": "CVE deleted successfully",
		"id":      id,
	})
}

// Get CVE statistics
func GetCVEStats(c *fiber.Ctx) error {
	stats := map[string]interface{}{
		"total_cves": 3,
		"by_severity": map[string]int{
			"low":      0,
			"medium":   1,
			"high":     1,
			"critical": 1,
		},
		"by_source": map[string]int{
			"nvd":   3,
			"mitre": 0,
		},
		"recent_count": 2,
		"last_updated": time.Now(),
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    stats,
		"message": "CVE statistics retrieved successfully",
	})
}
