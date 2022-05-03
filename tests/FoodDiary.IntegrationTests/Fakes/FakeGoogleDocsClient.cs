using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FoodDiary.Export.GoogleDocs;
using Google.Apis.Docs.v1.Data;

namespace FoodDiary.IntegrationTests.Fakes;

public class FakeGoogleDocsClient : IGoogleDocsClient
{
    private readonly FakeGoogleDocsReader _reader;
    private readonly List<Document> _documents = new();
    
    public const string NewDocId = "mTruDIuO4GigKXm0";

    public FakeGoogleDocsClient(FakeGoogleDocsReader reader)
    {
        _reader = reader;
    }

    public Task<Document?> GetDocumentAsync(string? documentId, string accessToken, CancellationToken cancellationToken)
    {
        var document = _documents.FirstOrDefault(d => d.DocumentId == documentId);
        
        return Task.FromResult(document);
    }

    public Task<Document> CreateDocumentAsync(string title, string accessToken, CancellationToken cancellationToken)
    {
        var document = new Document
        {
            DocumentId = NewDocId,
            Title = title
        };
        
        _documents.Add(document);
        
        return Task.FromResult(document);
    }

    public void InsertH1Text(Document document, string title)
    {
        _reader.LoadTitle(document.DocumentId, title);
    }

    public Task BatchUpdateDocumentAsync(string documentId, CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        _documents.Clear();
    }
}