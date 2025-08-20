package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// MusicHandler handles music-related requests similar to Spotify Web API
type MusicHandler struct{}

// NewMusicHandler creates a new MusicHandler instance
func NewMusicHandler() *MusicHandler {
	return &MusicHandler{}
}

// Artist represents a music artist
type Artist struct {
	ID           string            `json:"id"`
	Name         string            `json:"name"`
	Type         string            `json:"type"`
	URI          string            `json:"uri"`
	ExternalURLs map[string]string `json:"external_urls"`
	Href         string            `json:"href"`
	Images       []Image           `json:"images"`
	Genres       []string          `json:"genres"`
	Popularity   int               `json:"popularity"`
	Followers    Followers         `json:"followers"`
}

// Album represents a music album
type Album struct {
	ID                   string             `json:"id"`
	Name                 string             `json:"name"`
	Type                 string             `json:"type"`
	URI                  string             `json:"uri"`
	ExternalURLs         map[string]string  `json:"external_urls"`
	Href                 string             `json:"href"`
	Images               []Image            `json:"images"`
	AlbumType            string             `json:"album_type"`
	TotalTracks          int                `json:"total_tracks"`
	AvailableMarkets     []string           `json:"available_markets"`
	ReleaseDate          string             `json:"release_date"`
	ReleaseDatePrecision string             `json:"release_date_precision"`
	Artists              []SimplifiedArtist `json:"artists"`
	Tracks               TracksPaging       `json:"tracks"`
	Copyrights           []Copyright        `json:"copyrights"`
	ExternalIDs          map[string]string  `json:"external_ids"`
	Genres               []string           `json:"genres"`
	Label                string             `json:"label"`
	Popularity           int                `json:"popularity"`
}

// Track represents a music track
type Track struct {
	ID               string             `json:"id"`
	Name             string             `json:"name"`
	Type             string             `json:"type"`
	URI              string             `json:"uri"`
	ExternalURLs     map[string]string  `json:"external_urls"`
	Href             string             `json:"href"`
	Album            SimplifiedAlbum    `json:"album"`
	Artists          []SimplifiedArtist `json:"artists"`
	AvailableMarkets []string           `json:"available_markets"`
	DiscNumber       int                `json:"disc_number"`
	DurationMs       int                `json:"duration_ms"`
	Explicit         bool               `json:"explicit"`
	ExternalIDs      map[string]string  `json:"external_ids"`
	IsLocal          bool               `json:"is_local"`
	Popularity       int                `json:"popularity"`
	PreviewURL       *string            `json:"preview_url"`
	TrackNumber      int                `json:"track_number"`
	IsPlayable       bool               `json:"is_playable"`
}

// Playlist represents a music playlist
type Playlist struct {
	ID            string            `json:"id"`
	Name          string            `json:"name"`
	Type          string            `json:"type"`
	URI           string            `json:"uri"`
	ExternalURLs  map[string]string `json:"external_urls"`
	Href          string            `json:"href"`
	Images        []Image           `json:"images"`
	Description   *string           `json:"description"`
	Followers     Followers         `json:"followers"`
	Owner         PlaylistOwner     `json:"owner"`
	Public        bool              `json:"public"`
	Collaborative bool              `json:"collaborative"`
	SnapshotID    string            `json:"snapshot_id"`
	Tracks        PlaylistTracks    `json:"tracks"`
}

// Supporting structures
type Image struct {
	URL    string `json:"url"`
	Height *int   `json:"height"`
	Width  *int   `json:"width"`
}

type Followers struct {
	Href  *string `json:"href"`
	Total int     `json:"total"`
}

type SimplifiedArtist struct {
	ID           string            `json:"id"`
	Name         string            `json:"name"`
	Type         string            `json:"type"`
	URI          string            `json:"uri"`
	ExternalURLs map[string]string `json:"external_urls"`
	Href         string            `json:"href"`
}

type SimplifiedAlbum struct {
	ID                   string             `json:"id"`
	Name                 string             `json:"name"`
	Type                 string             `json:"type"`
	URI                  string             `json:"uri"`
	ExternalURLs         map[string]string  `json:"external_urls"`
	Href                 string             `json:"href"`
	Images               []Image            `json:"images"`
	AlbumType            string             `json:"album_type"`
	TotalTracks          int                `json:"total_tracks"`
	AvailableMarkets     []string           `json:"available_markets"`
	ReleaseDate          string             `json:"release_date"`
	ReleaseDatePrecision string             `json:"release_date_precision"`
	Artists              []SimplifiedArtist `json:"artists"`
}

type TracksPaging struct {
	Href     string            `json:"href"`
	Limit    int               `json:"limit"`
	Next     *string           `json:"next"`
	Offset   int               `json:"offset"`
	Previous *string           `json:"previous"`
	Total    int               `json:"total"`
	Items    []SimplifiedTrack `json:"items"`
}

type SimplifiedTrack struct {
	ID               string             `json:"id"`
	Name             string             `json:"name"`
	Type             string             `json:"type"`
	URI              string             `json:"uri"`
	ExternalURLs     map[string]string  `json:"external_urls"`
	Href             string             `json:"href"`
	Artists          []SimplifiedArtist `json:"artists"`
	AvailableMarkets []string           `json:"available_markets"`
	DiscNumber       int                `json:"disc_number"`
	DurationMs       int                `json:"duration_ms"`
	Explicit         bool               `json:"explicit"`
	IsLocal          bool               `json:"is_local"`
	IsPlayable       bool               `json:"is_playable"`
	PreviewURL       *string            `json:"preview_url"`
	TrackNumber      int                `json:"track_number"`
}

type Copyright struct {
	Text string `json:"text"`
	Type string `json:"type"`
}

type PlaylistOwner struct {
	ID           string            `json:"id"`
	Name         string            `json:"display_name"`
	Type         string            `json:"type"`
	URI          string            `json:"uri"`
	ExternalURLs map[string]string `json:"external_urls"`
	Href         string            `json:"href"`
	Followers    Followers         `json:"followers"`
}

type PlaylistTracks struct {
	Href  string `json:"href"`
	Total int    `json:"total"`
}

// Sample data generators
func generateSampleArtist(id string) Artist {
	return Artist{
		ID:   id,
		Name: "Sample Artist " + id,
		Type: "artist",
		URI:  "spotify:artist:" + id,
		ExternalURLs: map[string]string{
			"spotify": "https://open.spotify.com/artist/" + id,
		},
		Href: "https://api.spotify.com/v1/artists/" + id,
		Images: []Image{
			{URL: "https://i.scdn.co/image/ab6761610000e5ebf0789cd783c20985ec3bfa85", Width: intPtr(640), Height: intPtr(640)},
			{URL: "https://i.scdn.co/image/ab6761610000b273f0789cd783c20985ec3bfa85", Width: intPtr(300), Height: intPtr(300)},
		},
		Genres:     []string{"pop", "indie rock"},
		Popularity: 75,
		Followers: Followers{
			Href:  nil,
			Total: 1250000,
		},
	}
}

func generateSampleAlbum(id string) Album {
	artistId := uuid.New().String()
	return Album{
		ID:   id,
		Name: "Sample Album " + id,
		Type: "album",
		URI:  "spotify:album:" + id,
		ExternalURLs: map[string]string{
			"spotify": "https://open.spotify.com/album/" + id,
		},
		Href:                 "https://api.spotify.com/v1/albums/" + id,
		AlbumType:            "album",
		TotalTracks:          12,
		AvailableMarkets:     []string{"US", "GB", "DE", "FR", "ES"},
		ReleaseDate:          "2023-05-15",
		ReleaseDatePrecision: "day",
		Images: []Image{
			{URL: "https://i.scdn.co/image/ab67616d0000b273f54b99bf27cda88f4a7403ce", Width: intPtr(640), Height: intPtr(640)},
			{URL: "https://i.scdn.co/image/ab67616d00001e02f54b99bf27cda88f4a7403ce", Width: intPtr(300), Height: intPtr(300)},
		},
		Artists: []SimplifiedArtist{
			{
				ID:   artistId,
				Name: "Sample Artist",
				Type: "artist",
				URI:  "spotify:artist:" + artistId,
				ExternalURLs: map[string]string{
					"spotify": "https://open.spotify.com/artist/" + artistId,
				},
				Href: "https://api.spotify.com/v1/artists/" + artistId,
			},
		},
		Tracks: TracksPaging{
			Href:     "https://api.spotify.com/v1/albums/" + id + "/tracks",
			Limit:    20,
			Next:     nil,
			Offset:   0,
			Previous: nil,
			Total:    12,
			Items:    generateSampleTracks(12),
		},
		Copyrights: []Copyright{
			{Text: "2023 Sample Records", Type: "C"},
			{Text: "2023 Sample Records", Type: "P"},
		},
		ExternalIDs: map[string]string{
			"upc": "1234567890123",
		},
		Genres:     []string{"pop"},
		Label:      "Sample Records",
		Popularity: 80,
	}
}

func generateSampleTrack(id string) Track {
	artistId := uuid.New().String()
	albumId := uuid.New().String()
	previewURL := "https://p.scdn.co/mp3-preview/sample.mp3"

	return Track{
		ID:   id,
		Name: "Sample Track " + id,
		Type: "track",
		URI:  "spotify:track:" + id,
		ExternalURLs: map[string]string{
			"spotify": "https://open.spotify.com/track/" + id,
		},
		Href: "https://api.spotify.com/v1/tracks/" + id,
		Album: SimplifiedAlbum{
			ID:   albumId,
			Name: "Sample Album",
			Type: "album",
			URI:  "spotify:album:" + albumId,
			ExternalURLs: map[string]string{
				"spotify": "https://open.spotify.com/album/" + albumId,
			},
			Href:                 "https://api.spotify.com/v1/albums/" + albumId,
			AlbumType:            "album",
			TotalTracks:          12,
			AvailableMarkets:     []string{"US", "GB", "DE"},
			ReleaseDate:          "2023-05-15",
			ReleaseDatePrecision: "day",
			Images: []Image{
				{URL: "https://i.scdn.co/image/ab67616d0000b273f54b99bf27cda88f4a7403ce", Width: intPtr(640), Height: intPtr(640)},
			},
			Artists: []SimplifiedArtist{
				{
					ID:   artistId,
					Name: "Sample Artist",
					Type: "artist",
					URI:  "spotify:artist:" + artistId,
					ExternalURLs: map[string]string{
						"spotify": "https://open.spotify.com/artist/" + artistId,
					},
					Href: "https://api.spotify.com/v1/artists/" + artistId,
				},
			},
		},
		Artists: []SimplifiedArtist{
			{
				ID:   artistId,
				Name: "Sample Artist",
				Type: "artist",
				URI:  "spotify:artist:" + artistId,
				ExternalURLs: map[string]string{
					"spotify": "https://open.spotify.com/artist/" + artistId,
				},
				Href: "https://api.spotify.com/v1/artists/" + artistId,
			},
		},
		AvailableMarkets: []string{"US", "GB", "DE", "FR", "ES"},
		DiscNumber:       1,
		DurationMs:       210000, // 3:30 minutes
		Explicit:         false,
		ExternalIDs: map[string]string{
			"isrc": "USUM71505078",
		},
		IsLocal:     false,
		Popularity:  75,
		PreviewURL:  &previewURL,
		TrackNumber: 1,
		IsPlayable:  true,
	}
}

func generateSampleTracks(count int) []SimplifiedTrack {
	tracks := make([]SimplifiedTrack, count)
	for i := 0; i < count; i++ {
		trackId := uuid.New().String()
		artistId := uuid.New().String()
		previewURL := "https://p.scdn.co/mp3-preview/sample" + strconv.Itoa(i+1) + ".mp3"

		tracks[i] = SimplifiedTrack{
			ID:   trackId,
			Name: "Sample Track " + strconv.Itoa(i+1),
			Type: "track",
			URI:  "spotify:track:" + trackId,
			ExternalURLs: map[string]string{
				"spotify": "https://open.spotify.com/track/" + trackId,
			},
			Href: "https://api.spotify.com/v1/tracks/" + trackId,
			Artists: []SimplifiedArtist{
				{
					ID:   artistId,
					Name: "Sample Artist",
					Type: "artist",
					URI:  "spotify:artist:" + artistId,
					ExternalURLs: map[string]string{
						"spotify": "https://open.spotify.com/artist/" + artistId,
					},
					Href: "https://api.spotify.com/v1/artists/" + artistId,
				},
			},
			AvailableMarkets: []string{"US", "GB", "DE"},
			DiscNumber:       1,
			DurationMs:       180000 + (i * 15000), // Varying durations
			Explicit:         false,
			IsLocal:          false,
			IsPlayable:       true,
			PreviewURL:       &previewURL,
			TrackNumber:      i + 1,
		}
	}
	return tracks
}

// Utility function
func intPtr(i int) *int {
	return &i
}

// API Endpoints

// GetArtist returns a single artist by ID
func (h *MusicHandler) GetArtist(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Artist ID is required"})
	}

	artist := generateSampleArtist(id)
	return c.JSON(artist)
}

// GetAlbum returns a single album by ID
func (h *MusicHandler) GetAlbum(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Album ID is required"})
	}

	album := generateSampleAlbum(id)
	return c.JSON(album)
}

// GetTrack returns a single track by ID
func (h *MusicHandler) GetTrack(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Track ID is required"})
	}

	track := generateSampleTrack(id)
	return c.JSON(track)
}

// GetArtists returns multiple artists by IDs
func (h *MusicHandler) GetArtists(c *fiber.Ctx) error {
	ids := c.Query("ids")
	if ids == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Artist IDs are required"})
	}

	// For demo, return 3 sample artists
	artists := []Artist{
		generateSampleArtist("1"),
		generateSampleArtist("2"),
		generateSampleArtist("3"),
	}

	return c.JSON(fiber.Map{"artists": artists})
}

// GetAlbums returns multiple albums by IDs
func (h *MusicHandler) GetAlbums(c *fiber.Ctx) error {
	ids := c.Query("ids")
	if ids == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Album IDs are required"})
	}

	albums := []Album{
		generateSampleAlbum("1"),
		generateSampleAlbum("2"),
		generateSampleAlbum("3"),
	}

	return c.JSON(fiber.Map{"albums": albums})
}

// GetTracks returns multiple tracks by IDs
func (h *MusicHandler) GetTracks(c *fiber.Ctx) error {
	ids := c.Query("ids")
	if ids == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Track IDs are required"})
	}

	tracks := []Track{
		generateSampleTrack("1"),
		generateSampleTrack("2"),
		generateSampleTrack("3"),
	}

	return c.JSON(fiber.Map{"tracks": tracks})
}

// SearchMusic searches for artists, albums, tracks
func (h *MusicHandler) SearchMusic(c *fiber.Ctx) error {
	query := c.Query("q")
	if query == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Query parameter 'q' is required"})
	}

	searchType := c.Query("type", "track,artist,album")
	limit := c.QueryInt("limit", 20)
	offset := c.QueryInt("offset", 0)

	result := fiber.Map{}

	if contains(searchType, "artist") {
		result["artists"] = fiber.Map{
			"href":     "https://api.spotify.com/v1/search?q=" + query + "&type=artist",
			"limit":    limit,
			"next":     nil,
			"offset":   offset,
			"previous": nil,
			"total":    3,
			"items": []Artist{
				generateSampleArtist("search1"),
				generateSampleArtist("search2"),
				generateSampleArtist("search3"),
			},
		}
	}

	if contains(searchType, "album") {
		result["albums"] = fiber.Map{
			"href":     "https://api.spotify.com/v1/search?q=" + query + "&type=album",
			"limit":    limit,
			"next":     nil,
			"offset":   offset,
			"previous": nil,
			"total":    3,
			"items": []Album{
				generateSampleAlbum("search1"),
				generateSampleAlbum("search2"),
				generateSampleAlbum("search3"),
			},
		}
	}

	if contains(searchType, "track") {
		result["tracks"] = fiber.Map{
			"href":     "https://api.spotify.com/v1/search?q=" + query + "&type=track",
			"limit":    limit,
			"next":     nil,
			"offset":   offset,
			"previous": nil,
			"total":    3,
			"items": []Track{
				generateSampleTrack("search1"),
				generateSampleTrack("search2"),
				generateSampleTrack("search3"),
			},
		}
	}

	return c.JSON(result)
}

// Helper function to check if string contains substring
func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr ||
		(len(s) > len(substr) && (s[:len(substr)] == substr || s[len(s)-len(substr):] == substr ||
			len(s) > len(substr)+1 && s[1:len(substr)+1] == substr)))
}
