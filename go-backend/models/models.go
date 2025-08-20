package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	Email     string    `json:"email" gorm:"unique;not null"`
	Username  string    `json:"username" gorm:"unique;not null"`
	Password  string    `json:"password" gorm:"not null"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Avatar    string    `json:"avatar"`
	Role      string    `json:"role" gorm:"default:user"`
	IsActive  bool      `json:"is_active" gorm:"default:true"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Post struct {
	ID          uuid.UUID  `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	Title       string     `json:"title" gorm:"not null"`
	Content     string     `json:"content" gorm:"type:text"`
	Slug        string     `json:"slug" gorm:"unique;not null"`
	AuthorID    uuid.UUID  `json:"author_id" gorm:"type:uuid;not null"`
	Author      User       `json:"author" gorm:"foreignKey:AuthorID"`
	Status      string     `json:"status" gorm:"default:draft"`
	PublishedAt *time.Time `json:"published_at"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

type Comment struct {
	ID         uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	Content    string    `json:"content" gorm:"type:text;not null"`
	PostID     uuid.UUID `json:"post_id" gorm:"type:uuid;not null"`
	Post       Post      `json:"post" gorm:"foreignKey:PostID"`
	AuthorID   uuid.UUID `json:"author_id" gorm:"type:uuid;not null"`
	Author     User      `json:"author" gorm:"foreignKey:AuthorID"`
	IsApproved bool      `json:"is_approved" gorm:"default:false"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type Product struct {
	ID          uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	Name        string    `json:"name" gorm:"not null"`
	Description string    `json:"description" gorm:"type:text"`
	Price       float64   `json:"price" gorm:"type:decimal(10,2);not null"`
	Stock       int       `json:"stock" gorm:"default:0"`
	Category    string    `json:"category"`
	ImageURL    string    `json:"image_url"`
	IsActive    bool      `json:"is_active" gorm:"default:true"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Order struct {
	ID          uuid.UUID   `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	UserID      uuid.UUID   `json:"user_id" gorm:"type:uuid;not null"`
	User        User        `json:"user" gorm:"foreignKey:UserID"`
	TotalAmount float64     `json:"total_amount" gorm:"type:decimal(10,2);not null"`
	Status      string      `json:"status" gorm:"default:pending"`
	Items       []OrderItem `json:"items" gorm:"foreignKey:OrderID"`
	CreatedAt   time.Time   `json:"created_at"`
	UpdatedAt   time.Time   `json:"updated_at"`
}

type OrderItem struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	OrderID   uuid.UUID `json:"order_id" gorm:"type:uuid;not null"`
	ProductID uuid.UUID `json:"product_id" gorm:"type:uuid;not null"`
	Product   Product   `json:"product" gorm:"foreignKey:ProductID"`
	Quantity  int       `json:"quantity" gorm:"not null"`
	Price     float64   `json:"price" gorm:"type:decimal(10,2);not null"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type AnalyticsEvent struct {
	ID        uuid.UUID  `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	EventType string     `json:"event_type" gorm:"not null"`
	EventData string     `json:"event_data" gorm:"type:jsonb"`
	UserID    *uuid.UUID `json:"user_id" gorm:"type:uuid"`
	User      *User      `json:"user,omitempty" gorm:"foreignKey:UserID"`
	SessionID string     `json:"session_id"`
	IPAddress string     `json:"ip_address"`
	UserAgent string     `json:"user_agent"`
	CreatedAt time.Time  `json:"created_at"`
}

// BeforeCreate hook for User model
func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}

// BeforeCreate hook for Post model
func (p *Post) BeforeCreate(tx *gorm.DB) error {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return nil
}

// BeforeCreate hook for Comment model
func (c *Comment) BeforeCreate(tx *gorm.DB) error {
	if c.ID == uuid.Nil {
		c.ID = uuid.New()
	}
	return nil
}

// BeforeCreate hook for Product model
func (p *Product) BeforeCreate(tx *gorm.DB) error {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return nil
}

// BeforeCreate hook for Order model
func (o *Order) BeforeCreate(tx *gorm.DB) error {
	if o.ID == uuid.Nil {
		o.ID = uuid.New()
	}
	return nil
}

// BeforeCreate hook for OrderItem model
func (oi *OrderItem) BeforeCreate(tx *gorm.DB) error {
	if oi.ID == uuid.Nil {
		oi.ID = uuid.New()
	}
	return nil
}

// BeforeCreate hook for AnalyticsEvent model
func (ae *AnalyticsEvent) BeforeCreate(tx *gorm.DB) error {
	if ae.ID == uuid.Nil {
		ae.ID = uuid.New()
	}
	return nil
}

// CVE Vulnerability models
type CWE struct {
	Title    string `json:"title"`
	InfoLink string `json:"info_link"`
}

type CVE struct {
	ID                 uuid.UUID  `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	VulnID             string     `json:"vuln_id" gorm:"not null"`
	Source             string     `json:"source"`
	Aliases            string     `json:"aliases"`
	Published          time.Time  `json:"published"`
	Description        string     `json:"description" gorm:"type:text"`
	CWEs               []CWE      `json:"cwes" gorm:"type:json"`
	References         string     `json:"references" gorm:"type:text"`
	Severity           string     `json:"severity"`
	Analysis           string     `json:"analysis" gorm:"type:text"`
	Suppressed         string     `json:"suppressed"`
	CvssV3ImpactScore  float64    `json:"cvss_v3_impact_score"`
	CvssV3BaseScore    float64    `json:"cvss_v3_base_score"`
	CvssV3ExploitScore float64    `json:"cvss_v3_exploit_score"`
	EpssScore          float64    `json:"epssscore"`
	EpssPercentile     float64    `json:"epsspercentile"`
	CreatedAt          time.Time  `json:"created_at"`
	UpdatedAt          time.Time  `json:"updated_at"`
	DeletedAt          *time.Time `json:"deleted_at" gorm:"index"`
}

// BeforeCreate hook for CVE model
func (c *CVE) BeforeCreate(tx *gorm.DB) error {
	if c.ID == uuid.Nil {
		c.ID = uuid.New()
	}
	return nil
}
